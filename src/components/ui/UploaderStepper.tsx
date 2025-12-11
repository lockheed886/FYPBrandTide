import Papa from 'papaparse'
import { useState } from 'react'
import DataTable from './DataTable'
import { Upload, CheckCircle, AlertCircle, Play } from 'lucide-react'

type Row = Record<string, any>

export default function UploaderStepper({ onDone }: { onDone: (rows: Row[]) => void }) {
  const [step, setStep] = useState(0)
  const [rows, setRows] = useState<Row[]>([])
  const [errors, setErrors] = useState<string[]>([])

  function validateAndNext(rows: Row[]) {
    const required = ['review_text', 'brand']
    const hasProduct = rows[0] && ('product_id' in rows[0] || 'product_name' in rows[0])
    const missing = required.filter(k => !(k in rows[0]))
    const errs = []
    if (missing.length) errs.push('Missing required columns: ' + missing.join(', '))
    if (!hasProduct) errs.push('Must include either product_id OR product_name')
    setErrors(errs)
    if (errs.length === 0) { setStep(2); setRows(rows) }
  }

  return (
    <div className="space-y-4">
      {/* Stepper indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= n - 1 ? 'bg-accent text-white' : 'bg-gray-100 text-content-muted'
              }`}>
              {step > n - 1 ? <CheckCircle size={16} /> : n}
            </div>
            {n < 3 && <div className={`w-12 h-0.5 ${step >= n ? 'bg-accent' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
            <Upload size={32} className="mx-auto text-content-muted mb-3" />
            <span className="text-sm font-medium text-content">Click to upload CSV file</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return
                Papa.parse(f, {
                  header: true, complete: (res) => {
                    const data = (res.data as Row[]).filter(Boolean).slice(0, 500)
                    setRows(data)
                    setStep(1)
                  }
                })
              }}
            />
          </label>
          <p className="text-sm text-content-muted">
            Required columns: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">review_text</code>, <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">brand</code>, <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">product_id</code> OR <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">product_name</code>
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-content">Preview (first 50 rows):</p>
          <DataTable columns={Object.keys(rows[0] || {}).slice(0, 6).map(k => ({ key: k as any, label: k }))} records={rows.slice(0, 50) as any} />
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2" onClick={() => validateAndNext(rows)}>
              <CheckCircle size={16} />
              Validate
            </button>
            <button className="btn-secondary" onClick={() => setStep(0)}>Back</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {errors.length ? (
            <div className="p-4 border border-red-200 rounded-xl bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700 mb-1">Validation Errors</p>
                  <ul className="list-disc ml-5 text-sm text-red-600">
                    {errors.map((e, i) => (<li key={i}>{e}</li>))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-accent-100 rounded-xl bg-accent-50">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-accent" />
                <div>
                  <p className="font-medium text-accent-700">Validation Passed</p>
                  <p className="text-sm text-accent-600">Ready to run batch classification</p>
                </div>
              </div>
              <button
                className="btn-primary flex items-center gap-2 mt-4"
                onClick={() => { onDone(rows); }}
              >
                <Play size={16} />
                Run Classification
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
