"use client"

import { useState } from 'react'
import { CircleCheckIcon } from 'lucide-react'

import { Button } from './button'
import { Calendar } from './calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'
import { ScrollArea } from './scroll-area'

export const CalendarAppointmentBookingDemo = ({ onConfirm }: { onConfirm?: () => void }) => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>('10:00')

  const timeSlots = Array.from({ length: 37 }, (_, i) => {
    const totalMinutes = i * 15
    const hour = Math.floor(totalMinutes / 60) + 9
    const minute = totalMinutes % 60

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  })

  const bookedDates = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + 2 + i);
    return d;
  });

  return (
    <div className="w-full">
      <Card className='gap-0 p-0 border border-zinc-200 dark:border-[#27272a] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] bg-white dark:bg-[#18181b] overflow-hidden rounded-2xl relative'>
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-[#10b981]/10 blur-[80px]" />
            <div className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[80px]" />
        </div>

        <CardContent className='relative p-0 md:pr-[220px]'>
          <div className='p-6 flex justify-center items-center min-h-[380px]'>
            <Calendar
              mode='single'
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              disabled={[{ before: new Date(new Date().setHours(0, 0, 0, 0)) }, ...bookedDates]}
              showOutsideDays={false}
              modifiers={{
                booked: bookedDates
              }}
              modifiersClassNames={{
                booked: '[&>button]:line-through opacity-100 text-red-500/50'
              }}
              className='bg-transparent p-0 [--cell-size:--spacing(12)]'
              classNames={{
                day_selected: "bg-[#10b981] text-white hover:bg-[#10b981]/90 hover:text-white focus:bg-[#10b981] focus:text-white rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                day_today: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full",
                day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-all duration-200",
              }}
              formatters={{
                formatWeekdayName: date => {
                  return date.toLocaleString('en-US', { weekday: 'short' })
                }
              }}
            />
          </div>
          <div className='inset-y-0 right-0 flex w-full flex-col border-t max-md:h-60 md:absolute md:w-[220px] md:border-t-0 md:border-l border-zinc-200 dark:border-[#27272a] bg-zinc-50/50 dark:bg-black/20'>
            <div className="p-4 border-b border-zinc-200 dark:border-[#27272a]">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Available Times</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select a duration slot</p>
            </div>
            <ScrollArea className='flex-1'>
              <div className='flex flex-col gap-2 p-4'>
                {timeSlots.map(time => {
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                        key={time}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className={`w-full shadow-none transition-all duration-200 rounded-xl border ${
                            isSelected 
                            ? 'bg-[#10b981] hover:bg-[#059669] text-white border-transparent shadow-[0_4px_15px_rgba(16,185,129,0.3)]' 
                            : 'bg-white dark:bg-[#18181b] border-zinc-200 dark:border-[#27272a] hover:border-[#10b981]/50 hover:bg-[#10b981]/5 text-zinc-700 dark:text-zinc-300'
                        }`}
                    >
                        {time}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-4 border-t border-zinc-200 dark:border-[#27272a] px-6 py-5 md:flex-row bg-zinc-50/50 dark:bg-black/20 relative z-10'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm w-full'>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${date && selectedTime ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}`}>
                    <CircleCheckIcon className='size-5' />
                </div>
                <div className="flex flex-col">
                    {date && selectedTime ? (
                    <>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">Ready to book</span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                        </span>
                    </>
                    ) : (
                    <>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">Select a slot</span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">Choose date & time above</span>
                    </>
                    )}
                </div>
            </div>
            <Button 
                disabled={!date || !selectedTime} 
                className={`w-full sm:w-auto px-8 py-5 rounded-xl font-bold transition-all duration-300 ${
                    date && selectedTime 
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                }`} 
                onClick={() => onConfirm?.(date, selectedTime)}
            >
              Confirm Appointment
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CalendarAppointmentBookingDemo
