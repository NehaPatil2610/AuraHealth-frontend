import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, Clock, ChevronDown, X, Calendar } from 'lucide-react'
import SlotBooking from './SlotBooking'

// ── Mock Doctor Data ───────────────────────────────────────────
const MOCK_DOCTORS = [
    { id: 'd-001', name: 'Dr. Sarah Chen', specialization: 'Cardiologist', city: 'Mumbai', rating: 4.9, reviewCount: 142, slotsAvailable: 3, experience: '12 yrs', fee: '₹1,200' },
    { id: 'd-002', name: 'Dr. Marcus Hale', specialization: 'Dermatologist', city: 'Delhi', rating: 4.7, reviewCount: 98, slotsAvailable: 5, experience: '8 yrs', fee: '₹900' },
    { id: 'd-003', name: 'Dr. Priya Nair', specialization: 'Neurologist', city: 'Bangalore', rating: 4.8, reviewCount: 216, slotsAvailable: 2, experience: '15 yrs', fee: '₹1,500' },
    { id: 'd-004', name: 'Dr. Amit Desai', specialization: 'Orthopedic', city: 'Mumbai', rating: 4.6, reviewCount: 73, slotsAvailable: 4, experience: '10 yrs', fee: '₹1,100' },
    { id: 'd-005', name: 'Dr. Elena Rodriguez', specialization: 'Psychiatrist', city: 'Hyderabad', rating: 4.9, reviewCount: 187, slotsAvailable: 1, experience: '18 yrs', fee: '₹2,000' },
    { id: 'd-006', name: 'Dr. Raj Malhotra', specialization: 'General Physician', city: 'Delhi', rating: 4.5, reviewCount: 312, slotsAvailable: 7, experience: '6 yrs', fee: '₹500' },
    { id: 'd-007', name: 'Dr. Fatima Khan', specialization: 'Pediatrician', city: 'Bangalore', rating: 4.8, reviewCount: 164, slotsAvailable: 3, experience: '11 yrs', fee: '₹800' },
    { id: 'd-008', name: 'Dr. James Park', specialization: 'Oncologist', city: 'Mumbai', rating: 4.7, reviewCount: 89, slotsAvailable: 2, experience: '20 yrs', fee: '₹2,500' },
    { id: 'd-009', name: 'Dr. Ananya Iyer', specialization: 'Endocrinologist', city: 'Hyderabad', rating: 4.6, reviewCount: 56, slotsAvailable: 6, experience: '9 yrs', fee: '₹1,000' },
    { id: 'd-010', name: 'Dr. David Kim', specialization: 'Ophthalmologist', city: 'Delhi', rating: 4.8, reviewCount: 203, slotsAvailable: 4, experience: '14 yrs', fee: '₹1,300' },
    { id: 'd-011', name: 'Dr. Meera Kapoor', specialization: 'Gynecologist', city: 'Bangalore', rating: 4.9, reviewCount: 271, slotsAvailable: 2, experience: '16 yrs', fee: '₹1,400' },
    { id: 'd-012', name: 'Dr. Omar Hassan', specialization: 'Pulmonologist', city: 'Mumbai', rating: 4.5, reviewCount: 67, slotsAvailable: 5, experience: '7 yrs', fee: '₹950' },
]

const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad']

export default function DoctorFinder() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCity, setSelectedCity] = useState('All Cities')
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState(null)

    const filteredDoctors = useMemo(() => {
        return MOCK_DOCTORS.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCity = selectedCity === 'All Cities' || doc.city === selectedCity
            return matchesSearch && matchesCity
        })
    }, [searchQuery, selectedCity])

    // If a doctor is selected, show slot booking
    if (selectedDoctor) {
        return (
            <SlotBooking
                doctor={selectedDoctor}
                onBack={() => setSelectedDoctor(null)}
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or specialization..."
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl
                                   text-sm text-white placeholder-zinc-600
                                   focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                                   transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 cursor-pointer"
                        >
                            <X style={{ width: 14, height: 14 }} />
                        </button>
                    )}
                </div>

                {/* City Filter */}
                <div className="relative">
                    <button
                        onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/60 border border-zinc-800
                                   rounded-xl text-sm text-zinc-300 hover:border-zinc-700
                                   transition-colors cursor-pointer min-w-[160px]"
                    >
                        <MapPin style={{ width: 14, height: 14 }} className="text-zinc-500" />
                        <span className="flex-1 text-left">{selectedCity}</span>
                        <ChevronDown style={{ width: 14, height: 14 }} className={`text-zinc-500 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {cityDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute right-0 top-12 w-full bg-[#18181b] border border-zinc-800
                                           rounded-xl shadow-xl overflow-hidden z-20"
                            >
                                {CITIES.map(city => (
                                    <button
                                        key={city}
                                        onClick={() => { setSelectedCity(city); setCityDropdownOpen(false) }}
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                                            selectedCity === city
                                                ? 'text-emerald-400 bg-emerald-500/5'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                        }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-xs text-zinc-500">
                {filteredDoctors.length} physician{filteredDoctors.length !== 1 ? 's' : ''} found
                {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
            </p>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredDoctors.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.04, duration: 0.25 }}
                            onClick={() => setSelectedDoctor(doc)}
                            className="group bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5
                                       hover:border-emerald-500/30 hover:bg-zinc-900/60
                                       transition-all duration-300 cursor-pointer"
                        >
                            {/* Top Row: Avatar + Info */}
                            <div className="flex items-start gap-3.5">
                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800
                                                flex items-center justify-center text-sm font-bold text-white shrink-0
                                                group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-shadow">
                                    {doc.name.split(' ').slice(1).map(w => w[0]).join('')}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                                        {doc.name}
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">{doc.specialization}</p>
                                </div>
                            </div>

                            {/* Meta Row */}
                            <div className="flex items-center gap-4 mt-4 text-[11px] text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <MapPin style={{ width: 11, height: 11 }} />
                                    {doc.city}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock style={{ width: 11, height: 11 }} />
                                    {doc.experience}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star style={{ width: 11, height: 11 }} className="fill-amber-400 text-amber-400" />
                                    {doc.rating}
                                    <span className="text-zinc-600">({doc.reviewCount})</span>
                                </span>
                            </div>

                            {/* Bottom Row: Fee + Slots */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/40">
                                <span className="text-sm font-semibold text-white">{doc.fee}</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar style={{ width: 12, height: 12 }} className="text-emerald-500" />
                                    <span className={`text-xs font-medium ${
                                        doc.slotsAvailable <= 2 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                        {doc.slotsAvailable} slot{doc.slotsAvailable !== 1 ? 's' : ''} available
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-16">
                    <Search style={{ width: 32, height: 32 }} className="mx-auto text-zinc-700 mb-3" />
                    <p className="text-sm text-zinc-500">No physicians match your search criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCity('All Cities') }}
                        className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    )
}
