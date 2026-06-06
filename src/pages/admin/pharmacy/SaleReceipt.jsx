import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Receipt } from 'lucide-react';
import API from '../../../services/api';
import useSiteSettings from '../../../utils/useSiteSettings';

export default function SaleReceipt() {
  const { id } = useParams();
  const { settings } = useSiteSettings();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchSale() {
      setLoading(true);
      // Brief delay to ensure backend transaction is committed
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      try {
        const { data } = await API.get(`/pharmacy/sales/${id}/`);
        if (!cancelled) setSale(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSale();
    return () => { cancelled = true; };
  }, [id]);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${sale.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; width: 80mm; }
            .receipt { width: 100%; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; padding: 2px 0; }
            .header { margin-bottom: 8px; }
            .header h1 { font-size: 16px; margin-bottom: 2px; }
            .header p { font-size: 10px; color: #333; }
            .items { margin: 8px 0; }
            .total-row { font-size: 14px; font-weight: bold; }
            .footer { margin-top: 12px; font-size: 10px; text-align: center; color: #666; }
            @media print { body { width: 80mm; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>{error ? 'Failed to load receipt.' : 'Sale record not found.'}</p>
        <Link to="/admin/pharmacy/sales" className="text-primary-600 text-sm font-medium mt-2 inline-block">
          Back to Sales
        </Link>
      </div>
    );
  }

  const saleDate = new Date(sale.sale_date);
  const formattedDate = saleDate.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const formattedTime = saleDate.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
  const receiptNo = `SH-${String(sale.id).padStart(5, '0')}`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/pharmacy/sales"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Sale Receipt</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div ref={receiptRef}>
          <div className="receipt">
            {/* Hospital Header */}
            <div className="center header">
              <h1 className="bold">{settings.hospital_name || 'Swarna Hospitals'}</h1>
              <p>{settings.address || ''}</p>
              {settings.phone && <p>Ph: {settings.phone}</p>}
            </div>

            <div className="line" />

            {/* Receipt Info */}
            <div className="row">
              <span>Receipt No:</span>
              <span className="bold">{receiptNo}</span>
            </div>
            <div className="row">
              <span>Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="row">
              <span>Time:</span>
              <span>{formattedTime}</span>
            </div>
            {sale.patient_name && (
              <div className="row">
                <span>Patient:</span>
                <span>{sale.patient_name}</span>
              </div>
            )}
            {sale.patient_phone && (
              <div className="row">
                <span>Phone:</span>
                <span>{sale.patient_phone}</span>
              </div>
            )}

            <div className="line" />

            {/* Items */}
            <div className="items">
              <div className="row bold" style={{ marginBottom: '4px' }}>
                <span>Item</span>
                <span>Amount</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                <div className="row">
                  <span>{sale.medicine_name}</span>
                  <span>₹{Number(sale.total_amount).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {sale.quantity} x ₹{Number(sale.unit_price).toLocaleString('en-IN')} | Batch: {sale.batch_number}
                </div>
              </div>
            </div>

            <div className="line" />

            {/* Total */}
            <div className="row total-row">
              <span>TOTAL</span>
              <span>₹{Number(sale.total_amount).toLocaleString('en-IN')}</span>
            </div>

            <div className="line" />

            {/* Footer */}
            <div className="footer">
              <p>Thank you for choosing {settings.hospital_name || 'Swarna Hospitals'}!</p>
              <p>Get well soon. Take care.</p>
              {sale.sold_by_name && (
                <p style={{ marginTop: '4px' }}>Billed by: {sale.sold_by_name}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Styled Preview (what the user sees on screen) */}
      <style>{`
        .receipt .center { text-align: center; }
        .receipt .bold { font-weight: 700; }
        .receipt .line { border-top: 1px dashed #d1d5db; margin: 12px 0; }
        .receipt .row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 14px; }
        .receipt .header h1 { font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .receipt .header p { font-size: 12px; color: #6b7280; }
        .receipt .items { margin: 12px 0; }
        .receipt .total-row { font-size: 18px; font-weight: 700; color: #111827; }
        .receipt .footer { margin-top: 16px; text-align: center; font-size: 12px; color: #9ca3af; }
      `}</style>
    </div>
  );
}
