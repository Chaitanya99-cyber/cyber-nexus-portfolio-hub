from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

# Import models and utilities
from models import (
    Product, ProductCreate, ProductUpdate,
    Certification, CertificationCreate, CertificationUpdate,
    ContactMessage, ContactMessageCreate,
    Profile, ProfileUpdate,
    LoginRequest, LoginResponse,
    ContentSection, ContentSectionUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import (
    db, products_collection, certifications_collection,
    contact_messages_collection, profile_collection,
    admin_users_collection, content_sections_collection,
    init_default_admin, init_default_profile
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="GRC Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Authenticate admin user and return JWT token"""
    user = await admin_users_collection.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": user["id"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"]
        }
    }

@api_router.get("/auth/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify JWT token is valid"""
    return {"valid": True, "user": current_user}

# ==================== PRODUCTS ROUTES ====================

@api_router.get("/products", response_model=List[Product])
async def get_products(is_active: Optional[bool] = None):
    """Get all products, optionally filtered by active status"""
    query = {}
    if is_active is not None:
        query["is_active"] = is_active
    
    products = await products_collection.find(query).sort("display_order", 1).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await products_collection.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=Product)
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new product (admin only)"""
    product_dict = product.model_dump()
    product_obj = Product(**product_dict)
    
    await products_collection.insert_one(product_obj.model_dump())
    logger.info(f"Product created: {product_obj.id} by {current_user['email']}")
    return product_obj

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a product (admin only)"""
    existing_product = await products_collection.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await products_collection.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated_product = await products_collection.find_one({"id": product_id})
    logger.info(f"Product updated: {product_id} by {current_user['email']}")
    return updated_product

@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a product (admin only)"""
    result = await products_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    logger.info(f"Product deleted: {product_id} by {current_user['email']}")
    return {"message": "Product deleted successfully"}

# ==================== CERTIFICATIONS ROUTES ====================

@api_router.get("/certifications", response_model=List[Certification])
async def get_certifications(is_active: Optional[bool] = None):
    """Get all certifications, optionally filtered by active status"""
    query = {}
    if is_active is not None:
        query["is_active"] = is_active
    
    certifications = await certifications_collection.find(query).sort("display_order", 1).to_list(1000)
    return certifications

@api_router.get("/certifications/{certification_id}", response_model=Certification)
async def get_certification(certification_id: str):
    """Get a single certification by ID"""
    certification = await certifications_collection.find_one({"id": certification_id})
    if not certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    return certification

@api_router.post("/certifications", response_model=Certification)
async def create_certification(
    certification: CertificationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new certification (admin only)"""
    cert_dict = certification.model_dump()
    cert_obj = Certification(**cert_dict)
    
    await certifications_collection.insert_one(cert_obj.model_dump())
    logger.info(f"Certification created: {cert_obj.id} by {current_user['email']}")
    return cert_obj

@api_router.put("/certifications/{certification_id}", response_model=Certification)
async def update_certification(
    certification_id: str,
    certification_update: CertificationUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a certification (admin only)"""
    existing_cert = await certifications_collection.find_one({"id": certification_id})
    if not existing_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    update_data = certification_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await certifications_collection.update_one(
        {"id": certification_id},
        {"$set": update_data}
    )
    
    updated_cert = await certifications_collection.find_one({"id": certification_id})
    logger.info(f"Certification updated: {certification_id} by {current_user['email']}")
    return updated_cert

@api_router.delete("/certifications/{certification_id}")
async def delete_certification(
    certification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a certification (admin only)"""
    result = await certifications_collection.delete_one({"id": certification_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    logger.info(f"Certification deleted: {certification_id} by {current_user['email']}")
    return {"message": "Certification deleted successfully"}

# ==================== CONTACT MESSAGES ROUTES ====================

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(
    current_user: dict = Depends(get_current_user)
):
    """Get all contact messages (admin only)"""
    messages = await contact_messages_collection.find().sort("created_at", -1).to_list(1000)
    return messages

@api_router.post("/contact-messages", response_model=ContactMessage)
async def create_contact_message(message: ContactMessageCreate):
    """Submit a contact message (public endpoint)"""
    message_dict = message.model_dump()
    message_obj = ContactMessage(**message_dict)
    
    await contact_messages_collection.insert_one(message_obj.model_dump())
    logger.info(f"Contact message received from: {message.email}")
    return message_obj

@api_router.delete("/contact-messages/{message_id}")
async def delete_contact_message(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a contact message (admin only)"""
    result = await contact_messages_collection.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    logger.info(f"Contact message deleted: {message_id} by {current_user['email']}")
    return {"message": "Contact message deleted successfully"}

# ==================== PROFILE ROUTES ====================

@api_router.get("/profile", response_model=Profile)
async def get_profile():
    """Get profile information (public endpoint)"""
    profile = await profile_collection.find_one()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.put("/profile", response_model=Profile)
async def update_profile(
    profile_update: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update profile information (admin only)"""
    existing_profile = await profile_collection.find_one()
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await profile_collection.update_one(
        {"id": existing_profile["id"]},
        {"$set": update_data}
    )
    
    updated_profile = await profile_collection.find_one({"id": existing_profile["id"]})
    logger.info(f"Profile updated by {current_user['email']}")
    return updated_profile

# ==================== CONTENT SECTIONS ROUTES ====================

@api_router.get("/content/{section_name}")
async def get_content_section(section_name: str):
    """Get content for a specific section (public endpoint)"""
    section = await content_sections_collection.find_one({"section_name": section_name})
    if not section:
        # Return empty content if section doesn't exist yet
        return {"section_name": section_name, "content": {}}
    return section

@api_router.put("/content/{section_name}")
async def update_content_section(
    section_name: str,
    content_update: ContentSectionUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update content for a specific section (admin only)"""
    import uuid
    
    existing_section = await content_sections_collection.find_one({"section_name": section_name})
    
    if existing_section:
        # Update existing section
        await content_sections_collection.update_one(
            {"section_name": section_name},
            {"$set": {
                "content": content_update.content,
                "updated_at": datetime.utcnow()
            }}
        )
    else:
        # Create new section
        new_section = {
            "id": str(uuid.uuid4()),
            "section_name": section_name,
            "content": content_update.content,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await content_sections_collection.insert_one(new_section)
    
    updated_section = await content_sections_collection.find_one({"section_name": section_name})
    logger.info(f"Content section '{section_name}' updated by {current_user['email']}")
    return updated_section

# ==================== FILE UPLOAD ROUTE ====================

@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a file (admin only)"""
    import uuid
    from pathlib import Path
    
    # Create uploads directory if it doesn't exist
    upload_dir = Path("/app/backend/uploads")
    upload_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Save file
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Return file URL (adjust based on your deployment)
    file_url = f"/api/files/{unique_filename}"
    logger.info(f"File uploaded: {unique_filename} by {current_user['email']}")
    
    return {
        "filename": unique_filename,
        "url": file_url,
        "original_filename": file.filename
    }

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "GRC Portfolio API",
        "version": "1.0.0",
        "status": "operational"
    }

@api_router.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Check database connection
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    logger.info("Starting up...")
    await init_default_admin()
    await init_default_profile()
    logger.info("Application ready!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    logger.info("Shutting down...")
