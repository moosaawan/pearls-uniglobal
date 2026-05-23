'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard, Search, ArrowUpRight, ArrowDownRight,
  TrendingUp, Download, CheckCircle2, AlertTriangle, FileText,
  DollarSign, Trash2, Filter
} from 'lucide-react'
import { toast } from 'sonner'

interface Invoice {
  id: string
  student: string
  service: 'IELTS Academy' | 'University Application' | 'Visa Filing Assistance' | 'All-in-One Premium Bundle'
  amount: number
  commission: number
  status: 'paid' | 'pending' | 'overdue'
  date: string
  counselor: string
}

const initialInvoices: Invoice[] = [
  { id: 'inv-101', student: 'Moosa Khan', service: 'All-in-One Premium Bundle', amount: 150000, commission: 15000, status: 'paid', date: 'May 12, 2026', counselor: 'Sarah Ahmed' },
  { id: 'inv-102', student: 'Ayesha Rahman', service: 'University Application', amount: 75000, commission: 7500, status: 'paid', date: 'May 14, 2026', counselor: 'Sarah Ahmed' },
  { id: 'inv-103', student: 'Zainab Fatima', service: 'IELTS Academy', amount: 35000, commission: 3500, status: 'pending', date: 'May 18, 2026', counselor: 'Ali Raza' },
  { id: 'inv-104', student: 'Haris Abbasi', service: 'Visa Filing Assistance', amount: 50000, commission: 5000, status: 'overdue', date: 'Apr 28, 2026', counselor: 'Ali Raza' },
]

export default function AdminFinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const handleUpdateStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i))
    toast.success(`Invoice status updated to ${status}!`)
  }

  const handleDisburseCommission = (id: string, counselor: string, amount: number) => {
    toast.success(`Commission of PKR ${amount.toLocaleString()} successfully disbursed to counselor ${counselor}!`)
  }

  const handleDownloadInvoice = (id: string) => {
    toast.info(`Generating payment invoice PDF for record #${id}...`)
  }

  const filtered = invoices.filter(i => {
    const matchesSearch = i.student.toLowerCase().includes(search.toLowerCase()) ||
      i.service.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const selectedInvoice = invoices.find(i => i.id === selectedInvoiceId)

  // Math metrics
  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0)
  const totalReceived = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
  const commissionsDue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.commission, 0)

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-gold" /> Finance Ledger
          </h1>
          <p className="text-muted-foreground text-sm font-sans">Track invoice records, service fee collections, and calculate commission models for education advisors</p>
        </div>
      </motion.div>

      {/* Financial metrics bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        {[
          { label: 'Total Invoiced Amount', value: `PKR ${totalBilled.toLocaleString()}`, sub: 'All lifetime services', icon: CreditCard, color: 'text-blue-500' },
          { label: 'Revenue Received', value: `PKR ${totalReceived.toLocaleString()}`, sub: 'Deposits completed', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Outstanding Receivables', value: `PKR ${totalPending.toLocaleString()}`, sub: 'Awaiting student deposit', icon: AlertTriangle, color: 'text-yellow-600' },
          { label: 'Commissions Disbursed', value: `PKR ${commissionsDue.toLocaleString()}`, sub: 'From completed billings', icon: DollarSign, color: 'text-gold' },
        ].map((item, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm hover:shadow-premium transition-all duration-300">
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.label}</p>
                <p className="text-base font-bold text-foreground mt-1.5">{item.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-muted/10 flex items-center justify-center">
                <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters and search */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full font-sans text-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions by student name or service category..."
            className="pl-10 h-11 bg-background border-border/50 rounded-xl text-sm font-sans"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto font-sans text-xs">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-3 border border-border/50 rounded-xl bg-background outline-none text-foreground w-full sm:w-40"
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </motion.div>

      {/* List + Inspector grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start font-sans">
        <div className="lg:col-span-2 space-y-3.5">
          {filtered.length === 0 ? (
            <Card className="border-dashed border-2 border-border/40 text-center py-12">
              <CardContent>
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">No transaction listings match your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((invoice) => (
              <motion.div key={invoice.id} variants={fadeUp}>
                <Card
                  onClick={() => setSelectedInvoiceId(invoice.id === selectedInvoiceId ? null : invoice.id)}
                  className={`border-border/50 hover:shadow-premium shadow-sm transition-all duration-300 group cursor-pointer ${
                    selectedInvoiceId === invoice.id ? 'border-gold bg-gold/5' : ''
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold text-sm shrink-0 border border-border/30">
                        <DollarSign className="w-5 h-5 text-navy dark:text-gold" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate group-hover:text-gold transition-colors">
                          {invoice.student}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">
                          Service: <span className="text-foreground font-semibold">{invoice.service}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Date: <span className="text-foreground">{invoice.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2.5 shrink-0 self-end sm:self-center">
                      <p className="font-bold text-sm text-foreground">PKR {invoice.amount.toLocaleString()}</p>
                      <Badge className={`text-[8px] uppercase font-bold py-0.5 px-2 ${
                        invoice.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        invoice.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Invoice Actions Inspector */}
        <motion.div variants={fadeUp}>
          {selectedInvoice ? (
            <Card className="border-gold/30 shadow-premium overflow-hidden text-sm text-foreground bg-background">
              <div className="h-1.5 bg-gradient-gold" />
              <CardContent className="p-6 space-y-5">
                <div>
                  <Badge className={`text-[9px] uppercase font-bold py-0.5 px-2 mb-2 ${
                    selectedInvoice.status === 'paid' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    selectedInvoice.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {selectedInvoice.status}
                  </Badge>
                  <h4 className="font-bold text-foreground text-sm leading-tight">Billing Record #{selectedInvoice.id}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{selectedInvoice.service}</p>
                </div>

                <div className="space-y-3.5 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Payee Student:</span><span className="font-bold text-foreground">{selectedInvoice.student}</span></div>
                  <div className="flex justify-between"><span>Assigned Officer:</span><span className="font-semibold text-foreground">{selectedInvoice.counselor}</span></div>
                  <div className="flex justify-between"><span>Billing Total:</span><span className="font-bold text-foreground text-sm">PKR {selectedInvoice.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Advisor Commission:</span><span className="font-medium text-gold">PKR {selectedInvoice.commission.toLocaleString()}</span></div>
                </div>

                {/* Mark as Paid / Pending options */}
                <div className="space-y-2 border-t border-border pt-4 text-xs">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Configure Invoicing</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['paid', 'pending', 'overdue'].map((st) => (
                      <Button
                        key={st}
                        size="sm"
                        variant={selectedInvoice.status === st ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedInvoice.id, st as any)}
                        className={`capitalize h-8 text-[10px] rounded-lg ${
                          selectedInvoice.status === st && st === 'paid' ? 'bg-green-600 hover:bg-green-700 text-white' :
                          selectedInvoice.status === st && st === 'overdue' ? 'bg-red-500 hover:bg-red-600 text-white' :
                          selectedInvoice.status === st ? 'bg-gold text-navy hover:bg-gold/90' : 'border-border/50'
                        }`}
                      >
                        {st}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Disburse commissions and file downloading */}
                <div className="pt-4 border-t border-border flex flex-col gap-2">
                  <Button
                    onClick={() => handleDisburseCommission(selectedInvoice.id, selectedInvoice.counselor, selectedInvoice.commission)}
                    disabled={selectedInvoice.status !== 'paid'}
                    className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4" /> Disburse Counselor Commission
                  </Button>
                  <Button
                    onClick={() => handleDownloadInvoice(selectedInvoice.id)}
                    variant="outline"
                    className="w-full border-border/50 text-muted-foreground hover:bg-muted/10 rounded-xl h-9.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Generate PDF Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/50 text-center py-12 px-4 shadow-sm bg-muted/10">
              <CardContent className="space-y-2.5">
                <CreditCard className="w-10 h-10 mx-auto text-muted-foreground" />
                <h4 className="font-bold text-foreground text-sm">Select Invoice Entry</h4>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Click on any invoice listing card to reconcile balances, disburse sales commissions, or print PDF receipts.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
