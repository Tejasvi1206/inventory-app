from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product, Customer, Order
from app.models.schemas import DashboardOut

router = APIRouter()

@router.get("/", response_model=DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):
    low_stock = db.query(Product).filter(Product.quantity <= 5).all()
    return DashboardOut(
        total_products=db.query(Product).count(),
        total_customers=db.query(Customer).count(),
        total_orders=db.query(Order).count(),
        low_stock_products=low_stock,
    )
