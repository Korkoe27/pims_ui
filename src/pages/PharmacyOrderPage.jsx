// pages/PharmacyOrderPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetManagementPlanQuery } from "../redux/api/features/managementApi";
import { useGetPharmacyOrderQuery, useUpsertPharmacyOrderMutation } from "../redux/api/features/pharmacyApi";
import { showToast } from "../components/ToasterHelper";

export default function PharmacyOrderPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  // meds from management plan
  const { data: plan, isLoading: planLoading } = useGetManagementPlanQuery(appointmentId);
  // existing order (if any)
  const { data: order, isLoading: orderLoading } = useGetPharmacyOrderQuery(appointmentId);
  const [saveOrder, { isLoading: saving }] = useUpsertPharmacyOrderMutation();

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (order?.items?.length) {
      setRows(order.items);
    } else if (plan?.medication_instructions?.length) {
      setRows(
        plan.medication_instructions.map(mi => ({
          med_id: mi.id,
          name: mi.medication_name_display || mi.medication_name, // depends on your serializer
          dose: mi.medication_dosage,
          eye: mi.medication_eye,
          qty: 1,
          unit_price: "",
          note: "",
        }))
      );
    }
  }, [order, plan]);

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + Number((r.unit_price || 0) * (r.qty || 1)), 0),
    [rows]
  );

  const updateRow = (i, patch) =>
    setRows(prev => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const saveCosts = async () => {
    try {
      // 1) upsert order
      await saveOrder({
        appointmentId,
        data: { items: rows, total_price: total },
      }).unwrap();
      // 2) bump status via existing FSM endpoint
      await fetch(`/clients/api/appointments/${appointmentId}/transition/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_status: "Cost Added" }),
      }).then(r => {
        if (!r.ok) throw new Error("Failed to transition to Cost Added");
      });
      showToast("Costs saved and status set to Cost Added", "success");
      navigate("/appointments");
    } catch (e) {
      showToast(e?.data?.detail || e.message || "Failed to save pricing", "error");
    }
  };

  if (planLoading || orderLoading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pharmacy Pricing</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Medication</th>
              <th className="p-2">Eye</th>
              <th className="p-2">Dose</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Unit Price</th>
              <th className="p-2 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.eye}</td>
                <td className="p-2">{r.dose}</td>
                <td className="p-2">
                  <input type="number" min="1" className="w-20 border rounded p-1"
                         value={r.qty || 1}
                         onChange={e => updateRow(i, { qty: Number(e.target.value) })}/>
                </td>
                <td className="p-2">
                  <input type="number" step="0.01" className="w-24 border rounded p-1"
                         value={r.unit_price ?? ""}
                         onChange={e => updateRow(i, { unit_price: e.target.value })}/>
                </td>
                <td className="p-2 text-right">
                  {((r.unit_price || 0) * (r.qty || 1)).toFixed(2)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-gray-500">No medications on this plan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Total: GHS {total.toFixed(2)}</div>
        <div className="space-x-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={saveCosts} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
            {saving ? "Saving…" : "Save & Set Cost Added"}
          </button>
        </div>
      </div>
    </div>
  );
}
