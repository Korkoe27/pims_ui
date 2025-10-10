// pages/PharmacyOrder.jsx
import { useParams } from "react-router-dom";

export default function PharmacyOrder() {
  const { orderId } = useParams(); // "18be5e70-cfb2-4c52-bacc-7fc296d23085"
  return <div>Pharmacy Order: {orderId}</div>;
}
