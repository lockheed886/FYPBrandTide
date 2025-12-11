import GlassCard from '@/components/ui/GlassCard'
import UploaderStepper from '@/components/ui/UploaderStepper'
import DataTable from '@/components/ui/DataTable'
import { useState } from 'react'
import { classifyBatch } from '@/services/api'
import Papa from 'papaparse'
import { Download, Upload } from 'lucide-react'

export default function Batch() {
  const [rows, setRows] = useState<any[]>([])
  const [out, setOut] = useState<any[]>([])

  async function runBatch(data: any[]) {
    const res = await classifyBatch(data)
    setRows(data.slice(0, 50))
    setOut(res.slice(0, 50))
  }

  function download() {
    const csv = Papa.unparse(out)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'batch_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Upload className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-content">Batch Classification</h3>
            <p className="text-sm text-content-muted">Upload CSV files for bulk sentiment analysis</p>
          </div>
        </div>
        <UploaderStepper onDone={runBatch} />
      </GlassCard>

      {out.length > 0 && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-content">Results Preview (first 50 rows)</h3>
            <button className="btn-primary flex items-center gap-2" onClick={download}>
              <Download size={16} />
              Download Results CSV
            </button>
          </div>
          <DataTable
            columns={Object.keys(out[0]).slice(0, 6).map(k => ({ key: k as any, label: k }))}
            records={out as any}
          />
        </GlassCard>
      )}
    </div>
  )
}
