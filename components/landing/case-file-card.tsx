"use client"

import { motion } from "motion/react"

export function CaseFileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10, y: 24 }}
      animate={{ opacity: 1, rotate: -4, y: 0 }}
      whileHover={{ rotate: -1, scale: 1.02 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-sm rounded-sm bg-white p-6 text-[#1B1B18] shadow-[0_2px_0_#D8D3C4,0_20px_40px_-12px_rgba(27,27,24,0.45)] ring-1 ring-[#D8D3C4]"
    >
      <div className="flex items-start justify-between border-b border-dashed border-[#D8D3C4] pb-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#6B6558]">CASE FILE NO.</p>
          <p className="font-mono text-sm font-semibold">A-0417</p>
        </div>
        <div className="rotate-[8deg] rounded border-2 border-[#33415C] px-2 py-1 text-center">
          <p className="font-mono text-[9px] leading-tight font-bold tracking-wide text-[#33415C]">
            INTERVIEWING
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.15em] text-[#6B6558]">COMPANY</p>
          <p className="text-lg font-medium">Acme Corp</p>
        </div>
        <div>
          <p className="font-mono text-[10px] tracking-[0.15em] text-[#6B6558]">ROLE</p>
          <p className="text-base">Senior Product Engineer</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#6B6558]">APPLIED</p>
            <p className="font-mono text-sm">04.02</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#6B6558]">NEXT STEP</p>
            <p className="font-mono text-sm">Onsite, 04.17</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
