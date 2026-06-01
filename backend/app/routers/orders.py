from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Order, OrderItem, Product, Customer
from app.models.schemas import OrderCreate, OrderOut
from typing import List

router = APIRouter()

@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    # Validate customer
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = 0.0
    items_to_create = []

    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
            )
        total += product.price * item.quantity
        items_to_create.append((product, item.quantity, product.price))

    # Create order
    order = Order(customer_id=payload.customer_id, total_amount=round(total, 2))
    db.add(order)
    db.flush()

    # Deduct stock and create order items
    for product, qty, unit_price in items_to_create:
        product.quantity -= qty
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=unit_price
        )
        db.add(order_item)

    db.commit()
    db.refresh(order)
    return order

@router.get("/", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/{id}", response_model=OrderOut)
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Restore stock
    for item in order.order_items:
        item.product.quantity += item.quantity
    db.delete(order)
    db.commit()
