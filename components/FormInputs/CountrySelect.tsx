"use client"

import { useState, useEffect } from "react"
import Select from "react-tailwindcss-select"
import { Option, Options } from "react-tailwindcss-select/dist/components/type"
import countries from "world-countries"

type CountrySelectProps = {
  value?: string
  onChange: (value: string) => void
  label?: string
  labelShown?: boolean
}

export default function CountrySelect({
  value,
  onChange,
  label = "Country",
  labelShown = true,
}: CountrySelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  
  // Format countries data for the select component
  const countryOptions: Options = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    // Custom rendering with flag
    customRender: (
      <div className="flex items-center gap-2">
        <div className="h-4 w-6 overflow-hidden rounded-sm">
          <img 
            src={`https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`} 
            alt={country.name.common}
            className="h-full w-full object-cover"
          />
        </div>
        <span>{country.name.common}</span>
      </div>
    ),
  }))

  useEffect(() => {
    if (value) {
      const country = countries.find(
        (c) => c.cca2 === value || c.name.common.toLowerCase() === value.toLowerCase()
      )
      
      if (country) {
        setSelectedOption({
          value: country.cca2,
          label: country.name.common,
        })
      }
    }
  }, [value])
  

  // Handle selection change
  const handleSelectChange = (option: any) => {
    setSelectedOption(option)
    if (option) {
      const selectedCountry = countries.find((c) => c.cca2 === option.value)
      if (selectedCountry) {
        onChange(selectedCountry.name.common) 
      }
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
        options={countryOptions}
        placeholder={label}
      />
    </div>
  )
}
