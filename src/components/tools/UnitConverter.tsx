"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, Ruler, Thermometer, Scale, Clock, Zap
} from 'lucide-react';

const unitCategories = {
  length: {
    name: 'Length',
    icon: <Ruler className="h-4 w-4" />,
    baseUnit: 'meter',
    units: [
      { name: 'Millimeter', symbol: 'mm', multiplier: 0.001 },
      { name: 'Centimeter', symbol: 'cm', multiplier: 0.01 },
      { name: 'Meter', symbol: 'm', multiplier: 1 },
      { name: 'Kilometer', symbol: 'km', multiplier: 1000 },
      { name: 'Inch', symbol: 'in', multiplier: 0.0254 },
      { name: 'Foot', symbol: 'ft', multiplier: 0.3048 },
      { name: 'Yard', symbol: 'yd', multiplier: 0.9144 },
      { name: 'Mile', symbol: 'mi', multiplier: 1609.344 },
      { name: 'Nautical Mile', symbol: 'nmi', multiplier: 1852 },
    ]
  },
  weight: {
    name: 'Weight',
    icon: <Scale className="h-4 w-4" />,
    baseUnit: 'gram',
    units: [
      { name: 'Milligram', symbol: 'mg', multiplier: 0.001 },
      { name: 'Gram', symbol: 'g', multiplier: 1 },
      { name: 'Kilogram', symbol: 'kg', multiplier: 1000 },
      { name: 'Ounce', symbol: 'oz', multiplier: 28.3495 },
      { name: 'Pound', symbol: 'lb', multiplier: 453.592 },
      { name: 'Stone', symbol: 'st', multiplier: 6350.29 },
      { name: 'Ton (Metric)', symbol: 't', multiplier: 1000000 },
      { name: 'Ton (US)', symbol: 'ton', multiplier: 907185 },
    ]
  },
  temperature: {
    name: 'Temperature',
    icon: <Thermometer className="h-4 w-4" />,
    baseUnit: 'celsius',
    units: [
      { name: 'Celsius', symbol: '°C', multiplier: 1, offset: 0 },
      { name: 'Fahrenheit', symbol: '°F', multiplier: 1.8, offset: 32 },
      { name: 'Kelvin', symbol: 'K', multiplier: 1, offset: 273.15 },
      { name: 'Rankine', symbol: '°R', multiplier: 1.8, offset: 491.67 },
    ]
  },
  area: {
    name: 'Area',
    icon: <Calculator className="h-4 w-4" />,
    baseUnit: 'square meter',
    units: [
      { name: 'Square Millimeter', symbol: 'mm²', multiplier: 0.000001 },
      { name: 'Square Centimeter', symbol: 'cm²', multiplier: 0.0001 },
      { name: 'Square Meter', symbol: 'm²', multiplier: 1 },
      { name: 'Square Kilometer', symbol: 'km²', multiplier: 1000000 },
      { name: 'Square Inch', symbol: 'in²', multiplier: 0.00064516 },
      { name: 'Square Foot', symbol: 'ft²', multiplier: 0.092903 },
      { name: 'Square Yard', symbol: 'yd²', multiplier: 0.836127 },
      { name: 'Acre', symbol: 'ac', multiplier: 4046.86 },
      { name: 'Hectare', symbol: 'ha', multiplier: 10000 },
    ]
  },
  volume: {
    name: 'Volume',
    icon: <Calculator className="h-4 w-4" />,
    baseUnit: 'liter',
    units: [
      { name: 'Milliliter', symbol: 'ml', multiplier: 0.001 },
      { name: 'Liter', symbol: 'l', multiplier: 1 },
      { name: 'Cubic Meter', symbol: 'm³', multiplier: 1000 },
      { name: 'Fluid Ounce (US)', symbol: 'fl oz', multiplier: 0.0295735 },
      { name: 'Cup (US)', symbol: 'cup', multiplier: 0.236588 },
      { name: 'Pint (US)', symbol: 'pt', multiplier: 0.473176 },
      { name: 'Quart (US)', symbol: 'qt', multiplier: 0.946353 },
      { name: 'Gallon (US)', symbol: 'gal', multiplier: 3.78541 },
      { name: 'Gallon (Imperial)', symbol: 'gal (UK)', multiplier: 4.54609 },
    ]
  },
  speed: {
    name: 'Speed',
    icon: <Calculator className="h-4 w-4" />,
    baseUnit: 'meter per second',
    units: [
      { name: 'Meter per Second', symbol: 'm/s', multiplier: 1 },
      { name: 'Kilometer per Hour', symbol: 'km/h', multiplier: 0.277778 },
      { name: 'Mile per Hour', symbol: 'mph', multiplier: 0.44704 },
      { name: 'Foot per Second', symbol: 'ft/s', multiplier: 0.3048 },
      { name: 'Knot', symbol: 'kn', multiplier: 0.514444 },
      { name: 'Mach', symbol: 'Ma', multiplier: 343 },
    ]
  },
  time: {
    name: 'Time',
    icon: <Clock className="h-4 w-4" />,
    baseUnit: 'second',
    units: [
      { name: 'Nanosecond', symbol: 'ns', multiplier: 0.000000001 },
      { name: 'Microsecond', symbol: 'μs', multiplier: 0.000001 },
      { name: 'Millisecond', symbol: 'ms', multiplier: 0.001 },
      { name: 'Second', symbol: 's', multiplier: 1 },
      { name: 'Minute', symbol: 'min', multiplier: 60 },
      { name: 'Hour', symbol: 'h', multiplier: 3600 },
      { name: 'Day', symbol: 'd', multiplier: 86400 },
      { name: 'Week', symbol: 'wk', multiplier: 604800 },
      { name: 'Month', symbol: 'mo', multiplier: 2629746 },
      { name: 'Year', symbol: 'yr', multiplier: 31556952 },
    ]
  },
  energy: {
    name: 'Energy',
    icon: <Zap className="h-4 w-4" />,
    baseUnit: 'joule',
    units: [
      { name: 'Joule', symbol: 'J', multiplier: 1 },
      { name: 'Kilojoule', symbol: 'kJ', multiplier: 1000 },
      { name: 'Calorie', symbol: 'cal', multiplier: 4.184 },
      { name: 'Kilocalorie', symbol: 'kcal', multiplier: 4184 },
      { name: 'Watt Hour', symbol: 'Wh', multiplier: 3600 },
      { name: 'Kilowatt Hour', symbol: 'kWh', multiplier: 3600000 },
      { name: 'BTU', symbol: 'BTU', multiplier: 1055.06 },
      { name: 'Foot-pound', symbol: 'ft⋅lb', multiplier: 1.35582 },
    ]
  }
};

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const currentCategory = unitCategories[selectedCategory];

  const convertTemperature = (value, fromUnit, toUnit) => {
    let celsius = value;
    if (fromUnit.symbol === '°F') {
      celsius = (value - 32) / 1.8;
    } else if (fromUnit.symbol === 'K') {
      celsius = value - 273.15;
    } else if (fromUnit.symbol === '°R') {
      celsius = (value - 491.67) / 1.8;
    }

    if (toUnit.symbol === '°F') {
      return celsius * 1.8 + 32;
    } else if (toUnit.symbol === 'K') {
      return celsius + 273.15;
    } else if (toUnit.symbol === '°R') {
      return celsius * 1.8 + 491.67;
    }
    return celsius;
  };

  const performConversion = () => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      return;
    }

    const fromUnitData = currentCategory.units.find(u => u.symbol === fromUnit);
    const toUnitData = currentCategory.units.find(u => u.symbol === toUnit);

    if (!fromUnitData || !toUnitData) return;

    let convertedValue;

    if (selectedCategory === 'temperature') {
      convertedValue = convertTemperature(value, fromUnitData, toUnitData);
    } else {
      const baseValue = value * fromUnitData.multiplier;
      convertedValue = baseValue / toUnitData.multiplier;
    }

    const formattedResult = convertedValue.toString();
    setResult(formattedResult);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setFromUnit('');
    setToUnit('');
    setInputValue('');
    setResult('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Unit Converter
          </CardTitle>
          <CardDescription>
            Convert between different units of measurement with precision and ease
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {Object.entries(unitCategories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(key)}
                className="flex items-center gap-2 h-auto py-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentCategory.icon}
              {currentCategory.name} Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && performConversion()}
                  />
                </div>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory.units.map((unit) => (
                      <SelectItem key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <div className="relative">
                    <Input
                      value={result}
                      readOnly
                      className="bg-secondary/30"
                      placeholder="Result will appear here"
                    />
                  </div>
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory.units.map((unit) => (
                      <SelectItem key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={performConversion} 
                disabled={!inputValue || !fromUnit || !toUnit}
                className="flex-1"
              >
                Convert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;
