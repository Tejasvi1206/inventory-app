from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime

# ── Product ──────────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int
    description: Optional[str] = ""

    @field_validator("price")
    @classmethod
    def price_positive(cls, v):
        if v < 0:
            raise ValueError("Price cannot be negative")
        return v

    @field_validator("quantity")
    @classmethod
    def qty_non_negative(cls, v):
        if v < 0:
            raise ValueError("Quantity cannot be negative")
        return v

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    description: Optional[str] = None

class ProductOut(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Customer ─────────────────────────────────────────────────
class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Order ────────────────────────────────────────────────────
class OrderItemIn(BaseModel):
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def qty_positive(cls, v):
        if v <= 0:
            raise ValueError("Order quantity must be at least 1")
        return v

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemIn]

class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    status: str
    created_at: datetime
    order_items: List[OrderItemOut] = []

    class Config:
        from_attributes = True

# ── Dashboard ────────────────────────────────────────────────
class DashboardOut(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[ProductOut]
