"""
Analytics Models for Visitor Tracking
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

# Page View Event
class PageView(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_path: str
    page_title: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    visitor_id: str  # Anonymous identifier
    session_id: str
    country: Optional[str] = None
    city: Optional[str] = None
    device_type: Optional[str] = None  # mobile, desktop, tablet
    browser: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Visitor Session
class VisitorSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visitor_id: str
    session_start: datetime = Field(default_factory=datetime.utcnow)
    session_end: Optional[datetime] = None
    page_views: int = 0
    total_time: int = 0  # in seconds
    entry_page: str
    exit_page: Optional[str] = None
    is_unique_visitor: bool = True

# Analytics Summary (for dashboard)
class AnalyticsSummary(BaseModel):
    total_page_views: int
    unique_visitors: int
    total_sessions: int
    avg_session_duration: float
    top_pages: list
    popular_products: list
    contact_form_submissions: int
    date_range: str
