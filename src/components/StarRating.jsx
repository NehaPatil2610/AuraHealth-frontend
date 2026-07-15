import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, onRate = null, size = 'md', readOnly = false }) {
    const [hoverVal, setHoverVal] = useState(0)

    const sizeMap = { sm: 14, md: 18, lg: 22 }
    const iconSize = sizeMap[size] || sizeMap.md

    const stars = [1, 2, 3, 4, 5]
    const displayVal = hoverVal || rating

    return (
        <div className="flex items-center gap-0.5" role="group" aria-label="Star rating">
            {stars.map((val) => {
                const isFilled = val <= displayVal
                return (
                    <motion.button
                        key={val}
                        type="button"
                        disabled={readOnly}
                        onMouseEnter={() => !readOnly && setHoverVal(val)}
                        onMouseLeave={() => !readOnly && setHoverVal(0)}
                        onClick={() => !readOnly && onRate?.(val)}
                        whileHover={!readOnly ? { scale: 1.2 } : {}}
                        whileTap={!readOnly ? { scale: 0.9 } : {}}
                        className={`p-0.5 transition-colors duration-150 ${
                            readOnly ? 'cursor-default' : 'cursor-pointer'
                        }`}
                        aria-label={`${val} star${val > 1 ? 's' : ''}`}
                    >
                        <Star
                            style={{ width: iconSize, height: iconSize }}
                            className={`transition-colors duration-150 ${
                                isFilled
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-transparent text-zinc-600'
                            }`}
                        />
                    </motion.button>
                )
            })}
        </div>
    )
}
