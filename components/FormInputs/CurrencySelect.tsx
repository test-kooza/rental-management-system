"use client"

import { useState, useEffect } from "react"
import Select from "react-tailwindcss-select"
import { Option, Options } from "react-tailwindcss-select/dist/components/type"
import countries from "world-countries"

// Create a list of unique currencies from world-countries
const currencies = Array.from(
  new Set(
    countries.flatMap((country) => 
      Object.entries(country.currencies || {}).map(([code, currency]) => ({
        code,
        name: (currency as any).name,
        symbol: (currency as any).symbol,
        country: country.name.common
      }))
    )
  )
).sort((a, b) => a.name.localeCompare(b.name))

type CurrencySelectProps = {
  value?: string
  onChange: (value: string) => void
  label?: string
  labelShown?: boolean
}

export default function CurrencySelect({
  value,
  onChange,
  label = "Currency",
  labelShown = true,
}: CurrencySelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  
  // Format currencies data for the select component
  const currencyOptions: Options = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
    // Custom rendering with symbol
    customRender: (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
          <span className="text-xs font-medium">{currency.symbol}</span>
        </div>
        <span>{currency.code} - {currency.name}</span>
      </div>
    ),
  }))

  // Set initial selected option based on value prop
  useEffect(() => {
    if (value) {
      const currency = currencies.find(c => c.code === value)
      if (currency) {
        setSelectedOption({
          value: currency.code,
          label: `${currency.code} - ${currency.name}`,
        })
      }
    }
  }, [value])

  // Handle selection change
  const handleSelectChange = (option: any) => {
    setSelectedOption(option)
    if (option) {
      onChange(option.value as string)
    }
  }

  return (
    <div className="">
      {labelShown && (
        <h2 className="pb-2 block text-sm font-medium leading-6 text-gray-900">
          Select {label}
        </h2>
      )}
      <Select
        isSearchable
        primaryColor="red"
        value={selectedOption}
        onChange={handleSelectChange}
        options={currencyOptions}
        placeholder={label}
      />
    </div>
  )
}
