from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Collections
products_collection = db.products
certifications_collection = db.certifications
contact_messages_collection = db.contact_messages
profile_collection = db.profile
admin_users_collection = db.admin_users
content_sections_collection = db.content_sections
website_content_collection = db.website_content
analytics_pageviews_collection = db.analytics_pageviews
analytics_sessions_collection = db.analytics_sessions

async def init_default_admin():
    """Initialize default admin user if none exists"""
    from auth import get_password_hash
    import uuid
    from datetime import datetime
    
    admin_count = await admin_users_collection.count_documents({})
    if admin_count == 0:
        default_admin = {
            "id": str(uuid.uuid4()),
            "email": "admin@grc.com",
            "password_hash": get_password_hash("admin123"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await admin_users_collection.insert_one(default_admin)
        print("Default admin user created: admin@grc.com / admin123")

async def init_default_profile():
    """Initialize default profile if none exists"""
    import uuid
    from datetime import datetime
    
    profile_count = await profile_collection.count_documents({})
    if profile_count == 0:
        default_profile = {
            "id": str(uuid.uuid4()),
            "name": "Chaitanya Vichare",
            "title": "GRC Professional",
            "bio": "Experienced GRC professional specializing in governance, risk management, and compliance frameworks.",
            "email": "chaitanya@grc.com",
            "phone": "+1 (555) 123-4567",
            "location": "United States",
            "linkedin_url": "https://linkedin.com/in/chaitanya-vichare",
            "experience_years": 2.10,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await profile_collection.insert_one(default_profile)
        print("Default profile created")

async def init_default_website_content():
    """Initialize default website content if none exists"""
    import uuid
    from datetime import datetime
    
    content_count = await website_content_collection.count_documents({})
    if content_count == 0:
        default_content = {
            "id": str(uuid.uuid4()),
            "hero": {
                "title": "Chaitanya Vichare",
                "subtitle": "GRC Professional",
                "description": "Experienced professional specializing in governance, risk management, and compliance frameworks",
                "cta_text": "Get In Touch",
                "cta_link": "#contact"
            },
            "about": {
                "heading": "About Me",
                "subheading": "Professional Background",
                "bio": "Experienced GRC professional with expertise in governance, risk management, and compliance.",
                "description": "With over 2 years of experience in the GRC field, I help organizations build robust security and compliance frameworks.",
                "stats": [
                    {"label": "Years Experience", "value": "2.10+"},
                    {"label": "Projects Delivered", "value": "2"},
                    {"label": "Certifications", "value": "3+"}
                ]
            },
            "experience": {
                "heading": "Professional Experience",
                "subheading": "Career Journey",
                "experiences": []
            },
            "skills": {
                "heading": "Skills & Expertise",
                "subheading": "Technical Proficiencies",
                "categories": [
                    {
                        "id": str(uuid.uuid4()),
                        "name": "GRC & Compliance",
                        "skills": ["Risk Assessment", "Compliance Management", "Policy Development", "Audit Management"],
                        "display_order": 1
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "name": "Security Frameworks",
                        "skills": ["ISO 27001", "NIST", "SOC 2", "GDPR"],
                        "display_order": 2
                    }
                ]
            },
            "resume": {
                "heading": "Download Resume",
                "subheading": "Get My Complete Profile",
                "description": "Download my comprehensive resume for detailed information",
                "show_section": True
            },
            "settings": {
                "site_title": "GRC Portfolio - Chaitanya Vichare",
                "site_description": "Professional GRC portfolio showcasing expertise in governance, risk, and compliance",
                "primary_color": "#6366f1",
                "accent_color": "#8b5cf6",
                "footer_text": "© 2025 Chaitanya Vichare. All rights reserved.",
                "show_products_section": True,
                "show_certifications_section": True,
                "show_contact_section": True,
                "social_links": {
                    "linkedin": "https://linkedin.com/in/chaitanya-vichare",
                    "email": "chaitanya@grc.com"
                }
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await website_content_collection.insert_one(default_content)
        print("Default website content created")
