import { Bell, ChevronDown, CircleUserRound, Settings, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
const utcTime = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date())
export default function TopBar() {
  const [time, setTime] = useState(utcTime)
  useEffect(() => { const timer = window.setInterval(() => setTime(utcTime()), 1000); return () => window.clearInterval(timer) }, [])
  return <header className="top-bar"><div className="brand"><span className="brand-mark"><ShieldCheck size={18} /></span><span>SPACEGUARD</span><span className="brand-divider">/</span><span className="brand-sub">MISSION CONTROL</span></div><div className="top-actions"><div className="system-online"><i /> SYSTEM NOMINAL</div><div className="utc-clock"><span>UTC</span><strong>{time}</strong></div><button className="icon-button notification" aria-label="View notifications"><Bell size={18} /><b>2</b></button><button className="icon-button settings-button" aria-label="Settings"><Settings size={18} /></button><button className="profile-button"><CircleUserRound size={22} /><span>OPERATOR 01</span><ChevronDown size={14} /></button></div></header>
}
