'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Calculator, Beaker, Zap, BookOpen, Copy, Star, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Formula {
  id: string;
  name: string;
  formula: string;
  variables: { symbol: string; description: string; unit?: string }[];
  category: 'mathematics' | 'physics' | 'chemistry' | 'statistics' | 'geometry' | 'trigonometry' | 'calculus' | 'finance';
  description: string;
  usage: string;
  example: string;
  practicalExample: string;
  notes: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  applications: string[];
  derivedFrom?: string;
  relatedFormulas?: string[];
}

const formulas: Formula[] = [
  // Mathematics - Basic
  {
    id: 'quadratic',
    name: 'Quadratic Formula',
    formula: 'x = (-b ± √(b² - 4ac)) / 2a',
    variables: [
      { symbol: 'x', description: 'Solutions/roots' },
      { symbol: 'a', description: 'Coefficient of x²', unit: 'unitless' },
      { symbol: 'b', description: 'Coefficient of x', unit: 'unitless' },
      { symbol: 'c', description: 'Constant term', unit: 'unitless' }
    ],
    category: 'mathematics',
    description: 'Solves quadratic equations of the form ax² + bx + c = 0',
    usage: 'Used when factoring is difficult or impossible. Always check discriminant (b² - 4ac) first.',
    example: 'For 2x² - 5x + 2 = 0: a=2, b=-5, c=2\nx = (5 ± √(25-16))/4 = (5 ± 3)/4\nSolutions: x = 2 or x = 0.5',
    practicalExample: 'A ball is thrown upward with equation h = -16t² + 32t + 48. When does it hit the ground?\nSet h = 0: -16t² + 32t + 48 = 0\nDivide by -16: t² - 2t - 3 = 0\nUsing formula: t = (2 ± √(4+12))/2 = (2 ± 4)/2\nSolutions: t = 3 seconds (ball hits ground), t = -1 (invalid)',
    notes: [
      'If discriminant > 0: two real solutions',
      'If discriminant = 0: one real solution (repeated root)', 
      'If discriminant < 0: no real solutions (complex solutions)',
      'Always simplify the equation before applying the formula'
    ],
    difficulty: 'intermediate',
    applications: ['Projectile motion', 'Optimization problems', 'Engineering design', 'Economics'],
    relatedFormulas: ['discriminant', 'vertex_form']
  },
  {
    id: 'slope_intercept',
    name: 'Slope-Intercept Form',
    formula: 'y = mx + b',
    variables: [
      { symbol: 'y', description: 'Dependent variable' },
      { symbol: 'm', description: 'Slope (rise over run)' },
      { symbol: 'x', description: 'Independent variable' },
      { symbol: 'b', description: 'Y-intercept' }
    ],
    category: 'mathematics',
    description: 'Linear equation representing a straight line',
    usage: 'Use to find the equation of a line when you know slope and y-intercept, or to graph linear relationships.',
    example: 'Line with slope 3 and y-intercept -2: y = 3x - 2\nTo find y when x = 4: y = 3(4) - 2 = 10',
    practicalExample: 'A taxi charges $3 base fare plus $2 per mile.\nCost = 2(miles) + 3\nFor 7 miles: Cost = 2(7) + 3 = $17',
    notes: [
      'Positive slope: line rises left to right',
      'Negative slope: line falls left to right',
      'Zero slope: horizontal line',
      'Undefined slope: vertical line'
    ],
    difficulty: 'basic',
    applications: ['Economics (supply/demand)', 'Physics (velocity)', 'Business (cost analysis)', 'Statistics (trend lines)']
  },
  {
    id: 'arithmetic_sequence',
    name: 'Arithmetic Sequence',
    formula: 'aₙ = a₁ + (n-1)d',
    variables: [
      { symbol: 'aₙ', description: 'nth term' },
      { symbol: 'a₁', description: 'First term' },
      { symbol: 'n', description: 'Term number' },
      { symbol: 'd', description: 'Common difference' }
    ],
    category: 'mathematics',
    description: 'Formula for finding any term in an arithmetic sequence',
    usage: 'Use when you have a sequence with constant difference between consecutive terms.',
    example: 'Sequence: 3, 7, 11, 15... (d = 4)\nFind 10th term: a₁₀ = 3 + (10-1)×4 = 3 + 36 = 39',
    practicalExample: 'Theater seating: Row 1 has 20 seats, each row has 4 more seats than previous\nRow 12 seats = 20 + (12-1)×4 = 20 + 44 = 64 seats',
    notes: [
      'Common difference d = aₙ₊₁ - aₙ',
      'For decreasing sequences, d is negative',
      'Sum of n terms: Sₙ = n/2(2a₁ + (n-1)d)',
      'Graph is always a straight line'
    ],
    difficulty: 'basic',
    applications: ['Finance (loan payments)', 'Construction planning', 'Time scheduling', 'Population studies']
  },
  {
    id: 'geometric_sequence',
    name: 'Geometric Sequence',
    formula: 'aₙ = a₁ × r^(n-1)',
    variables: [
      { symbol: 'aₙ', description: 'nth term' },
      { symbol: 'a₁', description: 'First term' },
      { symbol: 'n', description: 'Term number' },
      { symbol: 'r', description: 'Common ratio' }
    ],
    category: 'mathematics',
    description: 'Formula for finding any term in a geometric sequence',
    usage: 'Use when you have a sequence where each term is multiplied by a constant ratio.',
    example: 'Sequence: 2, 6, 18, 54... (r = 3)\nFind 6th term: a₆ = 2 × 3^(6-1) = 2 × 243 = 486',
    practicalExample: 'Bacteria doubling every hour: Start with 100 bacteria\nAfter 8 hours: 100 × 2^(8-1) = 100 × 128 = 12,800 bacteria',
    notes: [
      'Common ratio r = aₙ₊₁ / aₙ',
      'If |r| < 1, sequence decreases toward 0',
      'If |r| > 1, sequence grows exponentially',
      'Sum of infinite series (|r| < 1): S∞ = a₁/(1-r)'
    ],
    difficulty: 'intermediate',
    applications: ['Population growth', 'Investment returns', 'Radioactive decay', 'Computer science algorithms']
  },
  {
    id: 'binomial_theorem',
    name: 'Binomial Theorem',
    formula: '(a + b)ⁿ = Σ C(n,k) × aⁿ⁻ᵏ × bᵏ',
    variables: [
      { symbol: 'a, b', description: 'Terms being expanded' },
      { symbol: 'n', description: 'Power/exponent' },
      { symbol: 'k', description: 'Term index (0 to n)' },
      { symbol: 'C(n,k)', description: 'Binomial coefficient' }
    ],
    category: 'mathematics',
    description: 'Expands binomial expressions raised to any power',
    usage: 'Use to expand (a + b)ⁿ without multiplying out completely. Essential for probability and algebra.',
    example: '(x + 2)³ = C(3,0)x³2⁰ + C(3,1)x²2¹ + C(3,2)x¹2² + C(3,3)x⁰2³\n= 1×x³×1 + 3×x²×2 + 3×x×4 + 1×1×8\n= x³ + 6x² + 12x + 8',
    practicalExample: 'Probability: Coin flipped 5 times, probability of exactly 3 heads\nP(3 heads) = C(5,3) × (0.5)³ × (0.5)² = 10 × 0.125 × 0.25 = 0.3125 = 31.25%',
    notes: [
      'C(n,k) = n! / (k!(n-k)!)',
      'Pascal\'s triangle gives binomial coefficients',
      'Sum of all coefficients = 2ⁿ',
      'Alternating sum of coefficients = 0 (if n > 0)'
    ],
    difficulty: 'advanced',
    applications: ['Probability theory', 'Statistics', 'Computer science', 'Engineering approximations']
  },

  // Geometry - Extended
  {
    id: 'distance_formula',
    name: 'Distance Formula',
    formula: 'd = √[(x₂-x₁)² + (y₂-y₁)²]',
    variables: [
      { symbol: 'd', description: 'Distance between points', unit: 'length' },
      { symbol: '(x₁,y₁)', description: 'First point coordinates' },
      { symbol: '(x₂,y₂)', description: 'Second point coordinates' }
    ],
    category: 'geometry',
    description: 'Calculates the straight-line distance between two points in a coordinate plane',
    usage: 'Essential for coordinate geometry, navigation, and computer graphics. Derived from Pythagorean theorem.',
    example: 'Distance between (1,2) and (4,6):\nd = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5',
    practicalExample: 'GPS navigation: Distance between New York (40.7°N, 74.0°W) and Boston (42.4°N, 71.1°W)\nUsing coordinate approximation: d ≈ √[(42.4-40.7)² + (-71.1-(-74.0))²] ≈ √[2.89 + 8.41] ≈ 3.36 units',
    notes: [
      'Always results in a positive value',
      'Can be extended to 3D: d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]',
      'For geographic distances, use spherical formulas instead',
      'Computationally expensive due to square root - consider squared distance for comparisons'
    ],
    difficulty: 'basic',
    applications: ['GPS navigation', 'Computer graphics', 'Engineering design', 'Architecture'],
    derivedFrom: 'Pythagorean theorem',
    relatedFormulas: ['pythagorean', 'midpoint_formula']
  },
  {
    id: 'pythagorean',
    name: 'Pythagorean Theorem',
    formula: 'a² + b² = c²',
    variables: [
      { symbol: 'a, b', description: 'Legs of right triangle', unit: 'length' },
      { symbol: 'c', description: 'Hypotenuse (longest side)', unit: 'length' }
    ],
    category: 'geometry',
    description: 'Fundamental relationship in right triangles between the sides',
    usage: 'Use whenever you have a right triangle and need to find a missing side. Verify right triangles by checking if the relationship holds.',
    example: 'Right triangle with legs 3 and 4:\nc² = 3² + 4² = 9 + 16 = 25\nc = √25 = 5',
    practicalExample: 'Ladder safety: A 13-foot ladder leans against a wall. If the base is 5 feet from the wall, how high does it reach?\nh² + 5² = 13²\nh² = 169 - 25 = 144\nh = 12 feet',
    notes: [
      'Only applies to RIGHT triangles (one 90° angle)',
      'Hypotenuse is always the longest side',
      'Common Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)',
      'Can be used to verify if a triangle is right-angled'
    ],
    difficulty: 'basic',
    applications: ['Construction', 'Navigation', 'Computer graphics', 'Architecture', 'Engineering'],
    relatedFormulas: ['distance_formula', 'law_of_cosines']
  },
  {
    id: 'circle_area',
    name: 'Circle Area',
    formula: 'A = πr²',
    variables: [
      { symbol: 'A', description: 'Area', unit: 'length²' },
      { symbol: 'r', description: 'Radius', unit: 'length' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' }
    ],
    category: 'geometry',
    description: 'Calculates the area enclosed by a circle',
    usage: 'Essential for calculating areas of circular regions, designing circular objects, or finding cross-sectional areas.',
    example: 'Circle with radius 5 units:\nA = π(5)² = 25π ≈ 78.54 square units',
    practicalExample: 'Pizza comparison: 12-inch diameter pizza has radius 6 inches\nArea = π(6)² = 36π ≈ 113 square inches\n16-inch diameter pizza has radius 8 inches\nArea = π(8)² = 64π ≈ 201 square inches\nThe 16-inch pizza has 78% more area!',
    notes: [
      'Radius is half the diameter: r = d/2',
      'Area grows with the square of radius - doubling radius quadruples area',
      'Use exact value (πr²) when possible, approximate when needed',
      'Common approximation: π ≈ 3.14 or 22/7'
    ],
    difficulty: 'basic',
    applications: ['Engineering design', 'Architecture', 'Manufacturing', 'Food industry', 'Landscaping']
  },
  {
    id: 'circle_circumference',
    name: 'Circle Circumference',
    formula: 'C = 2πr = πd',
    variables: [
      { symbol: 'C', description: 'Circumference', unit: 'length' },
      { symbol: 'r', description: 'Radius', unit: 'length' },
      { symbol: 'd', description: 'Diameter', unit: 'length' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' }
    ],
    category: 'geometry',
    description: 'Calculates the perimeter (distance around) a circle',
    usage: 'Use to find the distance around circular objects, calculate material needed for circular borders, or wheel rotations.',
    example: 'Circle with radius 4 meters:\nC = 2π(4) = 8π ≈ 25.13 meters',
    practicalExample: 'Bicycle wheel with 26-inch diameter travels how far in one rotation?\nC = πd = π(26) ≈ 81.7 inches per revolution\nIn 100 revolutions: 100 × 81.7 = 8,170 inches ≈ 681 feet',
    notes: [
      'Circumference/diameter ratio is always π',
      'Use 2πr when radius is known, πd when diameter is known',
      'Arc length formula: s = rθ (θ in radians)',
      'One complete revolution = 2π radians = 360°'
    ],
    difficulty: 'basic',
    applications: ['Wheel mechanics', 'Track design', 'Manufacturing', 'Sports field layout', 'Engineering']
  },
  {
    id: 'sphere_volume',
    name: 'Sphere Volume',
    formula: 'V = (4/3)πr³',
    variables: [
      { symbol: 'V', description: 'Volume', unit: 'length³' },
      { symbol: 'r', description: 'Radius', unit: 'length' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' }
    ],
    category: 'geometry',
    description: 'Calculates the volume of a sphere',
    usage: 'Used for calculating volumes of spherical objects like balls, planets, bubbles, or spherical tanks.',
    example: 'Sphere with radius 3 units:\nV = (4/3)π(3)³ = (4/3)π(27) = 36π ≈ 113.1 cubic units',
    practicalExample: 'Basketball volume: Official basketball diameter is 9.43 inches, so radius = 4.715 inches\nV = (4/3)π(4.715)³ ≈ (4/3)π(104.9) ≈ 439.6 cubic inches',
    notes: [
      'Volume grows with the cube of radius',
      'Surface area of same sphere: A = 4πr²',
      'Hemisphere volume is half: V = (2/3)πr³',
      'Remember the fraction 4/3 - common mistake to forget it'
    ],
    difficulty: 'intermediate',
    applications: ['Manufacturing', 'Astronomy', 'Medicine (cell analysis)', 'Sports equipment', 'Chemical engineering']
  },
  {
    id: 'sphere_surface_area',
    name: 'Sphere Surface Area',
    formula: 'A = 4πr²',
    variables: [
      { symbol: 'A', description: 'Surface area', unit: 'length²' },
      { symbol: 'r', description: 'Radius', unit: 'length' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' }
    ],
    category: 'geometry',
    description: 'Calculates the surface area of a sphere',
    usage: 'Use to find material needed to cover spherical objects, heat transfer calculations, or painting estimates.',
    example: 'Sphere with radius 2 meters:\nA = 4π(2)² = 4π(4) = 16π ≈ 50.27 square meters',
    practicalExample: 'Earth\'s surface area: radius ≈ 6,371 km\nA = 4π(6,371)² ≈ 4π(40,589,641) ≈ 510,072,000 km²\nActual Earth surface area: ~510.1 million km²',
    notes: [
      'Surface area is exactly 4 times the area of a great circle',
      'Hemisphere surface area (including base): A = 3πr²',
      'Related to volume: A/V = 3/r for sphere',
      'Useful for heat transfer and material calculations'
    ],
    difficulty: 'intermediate',
    applications: ['Material estimation', 'Heat transfer', 'Astronomy', 'Architecture', 'Manufacturing']
  },
  {
    id: 'cylinder_volume',
    name: 'Cylinder Volume',
    formula: 'V = πr²h',
    variables: [
      { symbol: 'V', description: 'Volume', unit: 'length³' },
      { symbol: 'r', description: 'Radius of base', unit: 'length' },
      { symbol: 'h', description: 'Height', unit: 'length' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' }
    ],
    category: 'geometry',
    description: 'Calculates the volume of a circular cylinder',
    usage: 'Essential for calculating capacity of cylindrical containers, tanks, pipes, and similar objects.',
    example: 'Cylinder with radius 3 cm and height 10 cm:\nV = π(3)²(10) = π(9)(10) = 90π ≈ 282.7 cubic cm',
    practicalExample: 'Water tank design: Cylindrical tank with 2m radius, 5m height\nV = π(2)²(5) = π(4)(5) = 20π ≈ 62.83 cubic meters\nCapacity ≈ 62,830 liters',
    notes: [
      'Base area × height gives volume',
      'Works for any prism with circular cross-section',
      'Surface area: A = 2πr² + 2πrh (including tops and sides)',
      'For hollow cylinder: V = π(R² - r²)h'
    ],
    difficulty: 'basic',
    applications: ['Tank design', 'Packaging', 'Engineering', 'Architecture', 'Manufacturing']
  },
  {
    id: 'triangle_area',
    name: 'Triangle Area',
    formula: 'A = ½bh',
    variables: [
      { symbol: 'A', description: 'Area', unit: 'length²' },
      { symbol: 'b', description: 'Base length', unit: 'length' },
      { symbol: 'h', description: 'Height (perpendicular to base)', unit: 'length' }
    ],
    category: 'geometry',
    description: 'Calculates the area of any triangle using base and height',
    usage: 'Most common formula for triangle area. Use when you know base and perpendicular height.',
    example: 'Triangle with base 8 units and height 5 units:\nA = ½(8)(5) = ½(40) = 20 square units',
    practicalExample: 'Roof area calculation: Triangular roof section with base 12 feet, height 8 feet\nA = ½(12)(8) = 48 square feet\nFor materials: need ~10% extra, so order materials for 53 sq ft',
    notes: [
      'Height must be perpendicular to the chosen base',
      'Any side can be chosen as the base',
      'Works for all triangles: right, acute, obtuse',
      'Alternative formulas: Heron\'s formula, ½ab sin(C)'
    ],
    difficulty: 'basic',
    applications: ['Construction', 'Architecture', 'Surveying', 'Art/design', 'Engineering']
  },

  // Trigonometry - Extended
  {
    id: 'sine_rule',
    name: 'Law of Sines',
    formula: 'a/sin(A) = b/sin(B) = c/sin(C)',
    variables: [
      { symbol: 'a, b, c', description: 'Sides of triangle', unit: 'length' },
      { symbol: 'A, B, C', description: 'Opposite angles', unit: 'degrees/radians' }
    ],
    category: 'trigonometry',
    description: 'Relates sides and angles in any triangle (not just right triangles)',
    usage: 'Use when you know: (1) Two angles and one side, or (2) Two sides and an angle opposite one of them.',
    example: 'Triangle with side a = 10, angle A = 30°, angle B = 45°:\nFirst find angle C = 180° - 30° - 45° = 105°\nUsing law of sines: b/sin(45°) = 10/sin(30°)\nb = 10 × sin(45°)/sin(30°) = 10 × 0.707/0.5 = 14.14',
    practicalExample: 'Surveying: From point A, a tower appears at 35° elevation. From point B (100m away), same tower at 25° elevation. Tower height?\nUsing triangle formed: angle at tower = 180° - 35° - 25° = 120°\nDistance to tower from A: 100/sin(120°) × sin(25°) ≈ 48.8m\nTower height = 48.8 × sin(35°) ≈ 28m',
    notes: [
      'Works for ANY triangle, not just right triangles',
      'Be careful with the ambiguous case (SSA) - may have two solutions',
      'Always check if your answer makes geometric sense',
      'Angles must be in same units (all degrees or all radians)'
    ],
    difficulty: 'intermediate',
    applications: ['Surveying', 'Navigation', 'Engineering', 'Architecture', 'Astronomy'],
    relatedFormulas: ['law_of_cosines', 'triangle_area']
  },
  {
    id: 'cosine_rule',
    name: 'Law of Cosines',
    formula: 'c² = a² + b² - 2ab·cos(C)',
    variables: [
      { symbol: 'a, b, c', description: 'Sides of triangle', unit: 'length' },
      { symbol: 'C', description: 'Angle opposite side c', unit: 'degrees/radians' }
    ],
    category: 'trigonometry',
    description: 'Generalization of Pythagorean theorem for any triangle',
    usage: 'Use when you know: (1) Three sides (to find angles), or (2) Two sides and included angle (to find third side).',
    example: 'Triangle with sides a = 5, b = 7, and included angle C = 60°:\nc² = 5² + 7² - 2(5)(7)cos(60°)\nc² = 25 + 49 - 70(0.5) = 74 - 35 = 39\nc = √39 ≈ 6.24',
    practicalExample: 'Baseball diamond: Distance from 1st base to 3rd base?\nBases are 90 feet apart, angle at 2nd base = 90°\nc² = 90² + 90² - 2(90)(90)cos(90°)\nc² = 8100 + 8100 - 16200(0) = 16200\nc = √16200 ≈ 127.3 feet',
    notes: [
      'Reduces to Pythagorean theorem when C = 90° (cos(90°) = 0)',
      'If C > 90°, cos(C) is negative, making the triangle "obtuse"',
      'If C < 90°, cos(C) is positive, making the triangle "acute"',
      'Can rearrange to find angles: cos(C) = (a² + b² - c²)/(2ab)'
    ],
    difficulty: 'intermediate',
    applications: ['Navigation', 'Engineering', 'Physics', 'Computer graphics', 'Architecture'],
    derivedFrom: 'Dot product of vectors',
    relatedFormulas: ['law_of_sines', 'pythagorean']
  },
  {
    id: 'sin_identity',
    name: 'Sine Function',
    formula: 'sin(θ) = opposite/hypotenuse',
    variables: [
      { symbol: 'θ', description: 'Angle', unit: 'degrees/radians' },
      { symbol: 'opposite', description: 'Side opposite to angle', unit: 'length' },
      { symbol: 'hypotenuse', description: 'Longest side', unit: 'length' }
    ],
    category: 'trigonometry',
    description: 'Basic trigonometric function relating angle to sides in right triangle',
    usage: 'Use to find angles when sides are known, or sides when angle is known. Essential for wave analysis.',
    example: 'Right triangle: opposite = 3, hypotenuse = 5\nsin(θ) = 3/5 = 0.6\nθ = arcsin(0.6) ≈ 36.87°',
    practicalExample: 'Ramp design: Need 10° incline, ramp is 20 feet long\nHeight = 20 × sin(10°) = 20 × 0.174 = 3.48 feet\nCheck: sin(10°) ≈ 0.174',
    notes: [
      'Range: -1 ≤ sin(θ) ≤ 1',
      'Period: 2π radians = 360°',
      'sin(30°) = 0.5, sin(45°) = √2/2, sin(60°) = √3/2',
      'sin(θ) = cos(90° - θ) (complementary angles)'
    ],
    difficulty: 'basic',
    applications: ['Wave physics', 'Engineering design', 'Signal processing', 'Architecture', 'Navigation']
  },
  {
    id: 'cos_identity',
    name: 'Cosine Function',
    formula: 'cos(θ) = adjacent/hypotenuse',
    variables: [
      { symbol: 'θ', description: 'Angle', unit: 'degrees/radians' },
      { symbol: 'adjacent', description: 'Side adjacent to angle', unit: 'length' },
      { symbol: 'hypotenuse', description: 'Longest side', unit: 'length' }
    ],
    category: 'trigonometry',
    description: 'Basic trigonometric function relating angle to sides in right triangle',
    usage: 'Use to find horizontal components of vectors, solve right triangles, analyze periodic phenomena.',
    example: 'Right triangle: adjacent = 4, hypotenuse = 5\ncos(θ) = 4/5 = 0.8\nθ = arccos(0.8) ≈ 36.87°',
    practicalExample: 'Solar panel efficiency: Panel tilted 30° from horizontal\nEffective area factor = cos(30°) = √3/2 ≈ 0.866\nIf panel is 2m², effective area = 2 × 0.866 = 1.73 m²',
    notes: [
      'Range: -1 ≤ cos(θ) ≤ 1',
      'Period: 2π radians = 360°',
      'cos(0°) = 1, cos(60°) = 0.5, cos(90°) = 0',
      'cos(θ) = sin(90° - θ) (complementary angles)'
    ],
    difficulty: 'basic',
    applications: ['Vector analysis', 'Physics', 'Engineering', 'Computer graphics', 'Astronomy']
  },
  {
    id: 'tan_identity',
    name: 'Tangent Function',
    formula: 'tan(θ) = opposite/adjacent = sin(θ)/cos(θ)',
    variables: [
      { symbol: 'θ', description: 'Angle', unit: 'degrees/radians' },
      { symbol: 'opposite', description: 'Side opposite to angle', unit: 'length' },
      { symbol: 'adjacent', description: 'Side adjacent to angle', unit: 'length' }
    ],
    category: 'trigonometry',
    description: 'Trigonometric function representing slope or rate of change',
    usage: 'Use for slope calculations, angle of elevation/depression, and rates of change problems.',
    example: 'Right triangle: opposite = 6, adjacent = 8\ntan(θ) = 6/8 = 0.75\nθ = arctan(0.75) ≈ 36.87°',
    practicalExample: 'Hill grade: Road rises 100 feet over 1000 feet horizontal distance\nSlope = tan(θ) = 100/1000 = 0.1\nAngle = arctan(0.1) ≈ 5.71°\nGrade = 10% (rise/run × 100%)',
    notes: [
      'Undefined when cos(θ) = 0 (at 90°, 270°, etc.)',
      'Period: π radians = 180°',
      'tan(45°) = 1, tan(0°) = 0',
      'Slope of line = tan(angle with x-axis)'
    ],
    difficulty: 'basic',
    applications: ['Surveying', 'Architecture', 'Engineering', 'Physics', 'Computer graphics']
  },

  // Physics - Mechanics
  {
    id: 'newtons_second',
    name: "Newton's Second Law",
    formula: 'F = ma',
    variables: [
      { symbol: 'F', description: 'Net force', unit: 'Newtons (N)' },
      { symbol: 'm', description: 'Mass', unit: 'kg' },
      { symbol: 'a', description: 'Acceleration', unit: 'm/s²' }
    ],
    category: 'physics',
    description: 'Fundamental law relating force, mass, and acceleration',
    usage: 'Use to find unknown force, mass, or acceleration when two are known. Essential for analyzing motion and designing mechanical systems.',
    example: 'Car with mass 1200 kg accelerates at 3 m/s²:\nF = ma = 1200 × 3 = 3600 N',
    practicalExample: 'Elevator design: 800 kg elevator must accelerate upward at 2 m/s²\nForces: Weight (down) = mg = 800 × 9.8 = 7840 N\nNet upward force needed = ma = 800 × 2 = 1600 N\nCable tension = 7840 + 1600 = 9440 N',
    notes: [
      'F represents NET force (sum of all forces)',
      'Force and acceleration are vectors (have direction)',
      'If net force = 0, acceleration = 0 (object moves at constant velocity)',
      'Units: 1 Newton = 1 kg⋅m/s²'
    ],
    difficulty: 'basic',
    applications: ['Vehicle design', 'Structural engineering', 'Aerospace', 'Sports science', 'Robotics'],
    relatedFormulas: ['kinetic_energy', 'momentum', 'work_energy']
  },
  {
    id: 'kinematic_velocity',
    name: 'Kinematic Velocity Equation',
    formula: 'v = v₀ + at',
    variables: [
      { symbol: 'v', description: 'Final velocity', unit: 'm/s' },
      { symbol: 'v₀', description: 'Initial velocity', unit: 'm/s' },
      { symbol: 'a', description: 'Acceleration', unit: 'm/s²' },
      { symbol: 't', description: 'Time', unit: 's' }
    ],
    category: 'physics',
    description: 'Calculates final velocity under constant acceleration',
    usage: 'Use for motion problems with constant acceleration. Essential for projectile motion, vehicle dynamics, and falling objects.',
    example: 'Car accelerates from rest at 2 m/s² for 10 seconds:\nv = 0 + 2(10) = 20 m/s',
    practicalExample: 'Dragster acceleration: Starting from rest, reaches 100 m/s in 5 seconds\nFind acceleration: a = (v - v₀)/t = (100 - 0)/5 = 20 m/s²\nAfter 3 seconds: v = 0 + 20(3) = 60 m/s',
    notes: [
      'Only valid for CONSTANT acceleration',
      'Choose positive direction consistently',
      'For deceleration, acceleration is negative',
      'Initial velocity v₀ = 0 when starting from rest'
    ],
    difficulty: 'basic',
    applications: ['Automotive engineering', 'Aerospace', 'Sports analysis', 'Safety calculations', 'Transportation']
  },
  {
    id: 'kinematic_position',
    name: 'Kinematic Position Equation',
    formula: 's = v₀t + ½at²',
    variables: [
      { symbol: 's', description: 'Displacement', unit: 'm' },
      { symbol: 'v₀', description: 'Initial velocity', unit: 'm/s' },
      { symbol: 't', description: 'Time', unit: 's' },
      { symbol: 'a', description: 'Acceleration', unit: 'm/s²' }
    ],
    category: 'physics',
    description: 'Calculates displacement under constant acceleration',
    usage: 'Use to find how far an object travels during accelerated motion. Essential for projectile motion and falling objects.',
    example: 'Object starts with velocity 5 m/s, accelerates at 2 m/s² for 4 seconds:\ns = 5(4) + ½(2)(4)² = 20 + 16 = 36 meters',
    practicalExample: 'Stopping distance: Car traveling 25 m/s brakes with deceleration -8 m/s²\nTime to stop: v = v₀ + at → 0 = 25 + (-8)t → t = 3.125 s\nStopping distance: s = 25(3.125) + ½(-8)(3.125)² = 78.125 - 39.0625 = 39.06 m',
    notes: [
      'Only valid for CONSTANT acceleration',
      'First term (v₀t) is distance at constant velocity',
      'Second term (½at²) is additional distance due to acceleration',
      'For free fall: a = -9.8 m/s² (downward)'
    ],
    difficulty: 'basic',
    applications: ['Traffic safety', 'Projectile motion', 'Space missions', 'Sports physics', 'Engineering design']
  },
  {
    id: 'kinetic_energy',
    name: 'Kinetic Energy',
    formula: 'KE = ½mv²',
    variables: [
      { symbol: 'KE', description: 'Kinetic energy', unit: 'Joules (J)' },
      { symbol: 'm', description: 'Mass', unit: 'kg' },
      { symbol: 'v', description: 'Velocity', unit: 'm/s' }
    ],
    category: 'physics',
    description: 'Energy possessed by an object due to its motion',
    usage: 'Essential for energy calculations, collision analysis, and understanding the relationship between speed and energy.',
    example: 'Car (1000 kg) traveling at 20 m/s:\nKE = ½(1000)(20)² = ½(1000)(400) = 200,000 J = 200 kJ',
    practicalExample: 'Vehicle safety: Compare kinetic energies at different speeds\nAt 30 mph (13.4 m/s): KE = ½(1500)(13.4)² = 134,670 J\nAt 60 mph (26.8 m/s): KE = ½(1500)(26.8)² = 538,680 J\nDoubling speed QUADRUPLES kinetic energy!',
    notes: [
      'Energy increases with the SQUARE of velocity',
      'Always positive (velocity is squared)',
      'Kinetic energy = 0 when object is at rest',
      '1 Joule = 1 kg⋅m²/s²'
    ],
    difficulty: 'basic',
    applications: ['Vehicle safety', 'Sports physics', 'Energy conversion', 'Collision analysis', 'Power generation'],
    relatedFormulas: ['potential_energy', 'work_energy', 'momentum']
  },
  {
    id: 'potential_energy',
    name: 'Gravitational Potential Energy',
    formula: 'PE = mgh',
    variables: [
      { symbol: 'PE', description: 'Potential energy', unit: 'Joules (J)' },
      { symbol: 'm', description: 'Mass', unit: 'kg' },
      { symbol: 'g', description: 'Gravitational acceleration', unit: '9.8 m/s²' },
      { symbol: 'h', description: 'Height above reference', unit: 'm' }
    ],
    category: 'physics',
    description: 'Energy stored due to position in a gravitational field',
    usage: 'Calculate energy stored at height, analyze roller coasters, design hydroelectric systems, study pendulums.',
    example: 'Book (2 kg) on shelf 3 meters high:\nPE = mgh = 2 × 9.8 × 3 = 58.8 J',
    practicalExample: 'Hydroelectric dam: Water (1000 kg/m³) falls 50m through turbine\nFor 1 m³ of water: PE = mgh = 1000 × 9.8 × 50 = 490,000 J = 490 kJ\nThis energy converts to electricity (minus efficiency losses)',
    notes: [
      'Reference height can be chosen arbitrarily',
      'Only CHANGES in height matter for energy calculations',
      'Negative potential energy possible if below reference',
      'g ≈ 9.8 m/s² on Earth (varies slightly by location)'
    ],
    difficulty: 'basic',
    applications: ['Hydroelectric power', 'Roller coaster design', 'Construction', 'Pendulum clocks', 'Satellite orbits'],
    relatedFormulas: ['kinetic_energy', 'conservation_energy', 'work_energy']
  },
  {
    id: 'work_energy',
    name: 'Work-Energy Theorem',
    formula: 'W = ΔKE = KE_final - KE_initial',
    variables: [
      { symbol: 'W', description: 'Work done', unit: 'Joules (J)' },
      { symbol: 'ΔKE', description: 'Change in kinetic energy', unit: 'Joules (J)' },
      { symbol: 'KE_final', description: 'Final kinetic energy', unit: 'Joules (J)' },
      { symbol: 'KE_initial', description: 'Initial kinetic energy', unit: 'Joules (J)' }
    ],
    category: 'physics',
    description: 'Work done on an object equals its change in kinetic energy',
    usage: 'Connect force/work concepts to energy. Useful for analyzing systems where forces do work over distances.',
    example: 'Car (1000 kg) accelerates from 10 m/s to 20 m/s:\nKE_initial = ½(1000)(10)² = 50,000 J\nKE_final = ½(1000)(20)² = 200,000 J\nWork done = 200,000 - 50,000 = 150,000 J',
    practicalExample: 'Braking system: Car (1500 kg) at 25 m/s stops completely\nInitial KE = ½(1500)(25)² = 468,750 J\nFinal KE = 0 J\nWork by brakes = 0 - 468,750 = -468,750 J (negative because force opposes motion)',
    notes: [
      'Work can be positive (speeds up) or negative (slows down)',
      'Work = Force × distance (when force is constant)',
      'Conservative forces: work independent of path',
      'Units: 1 Joule = 1 Newton⋅meter'
    ],
    difficulty: 'intermediate',
    applications: ['Engine design', 'Brake systems', 'Energy analysis', 'Mechanical engineering', 'Sports science']
  },
  {
    id: 'momentum',
    name: 'Linear Momentum',
    formula: 'p = mv',
    variables: [
      { symbol: 'p', description: 'Momentum', unit: 'kg⋅m/s' },
      { symbol: 'm', description: 'Mass', unit: 'kg' },
      { symbol: 'v', description: 'Velocity', unit: 'm/s' }
    ],
    category: 'physics',
    description: 'Quantity of motion possessed by an object',
    usage: 'Essential for collision analysis, rocket propulsion, and understanding conservation laws in physics.',
    example: 'Baseball (0.145 kg) thrown at 40 m/s:\np = mv = 0.145 × 40 = 5.8 kg⋅m/s',
    practicalExample: 'Car collision: 1200 kg car at 15 m/s hits 800 kg car at rest\nInitial momentum = 1200 × 15 + 800 × 0 = 18,000 kg⋅m/s\nAfter collision (stuck together): (1200 + 800) × v_final = 18,000\nFinal velocity = 18,000 / 2000 = 9 m/s',
    notes: [
      'Momentum is a vector (has direction)',
      'Conservation of momentum: total momentum before = total momentum after',
      'Related to impulse: Impulse = change in momentum',
      'Newton\'s second law: F = dp/dt'
    ],
    difficulty: 'basic',
    applications: ['Collision analysis', 'Rocket science', 'Sports physics', 'Particle physics', 'Vehicle safety']
  },

  // Electricity & Magnetism
  {
    id: 'ohms_law',
    name: "Ohm's Law",
    formula: 'V = IR',
    variables: [
      { symbol: 'V', description: 'Voltage (potential difference)', unit: 'Volts (V)' },
      { symbol: 'I', description: 'Current', unit: 'Amperes (A)' },
      { symbol: 'R', description: 'Resistance', unit: 'Ohms (Ω)' }
    ],
    category: 'physics',
    description: 'Fundamental relationship in electrical circuits',
    usage: 'Essential for all electrical circuit analysis, component selection, and power calculations.',
    example: 'Circuit with 12V battery and 4Ω resistor:\nI = V/R = 12/4 = 3 A',
    practicalExample: 'LED circuit design: LED needs 20mA current, has 2V drop, powered by 9V battery\nVoltage across resistor = 9V - 2V = 7V\nRequired resistance: R = V/I = 7V/0.02A = 350Ω\nUse standard 390Ω resistor for safety margin',
    notes: [
      'Only applies to ohmic materials (linear relationship)',
      'Power relationships: P = VI = I²R = V²/R',
      'Higher resistance = lower current for same voltage',
      'Temperature affects resistance in most materials'
    ],
    difficulty: 'basic',
    applications: ['Electronics design', 'Electrical engineering', 'Circuit analysis', 'Power systems', 'Safety calculations'],
    relatedFormulas: ['electrical_power', 'resistors_series', 'resistors_parallel']
  },
  {
    id: 'electrical_power',
    name: 'Electrical Power',
    formula: 'P = VI = I²R = V²/R',
    variables: [
      { symbol: 'P', description: 'Power', unit: 'Watts (W)' },
      { symbol: 'V', description: 'Voltage', unit: 'Volts (V)' },
      { symbol: 'I', description: 'Current', unit: 'Amperes (A)' },
      { symbol: 'R', description: 'Resistance', unit: 'Ohms (Ω)' }
    ],
    category: 'physics',
    description: 'Rate of energy consumption or production in electrical circuits',
    usage: 'Calculate power consumption, size electrical components, determine energy costs, design power supplies.',
    example: 'Heater with 10A current at 120V:\nP = VI = 120 × 10 = 1200 W = 1.2 kW',
    practicalExample: 'Household energy cost: 100W light bulb runs 8 hours/day\nDaily energy = 100W × 8h = 800 Wh = 0.8 kWh\nMonthly (30 days) = 0.8 × 30 = 24 kWh\nCost at $0.12/kWh = 24 × $0.12 = $2.88/month',
    notes: [
      'Power is always positive (energy consumed/produced)',
      'Use appropriate formula based on known values',
      'Higher voltage OR current increases power',
      '1 Watt = 1 Joule/second'
    ],
    difficulty: 'basic',
    applications: ['Energy audits', 'Component rating', 'Power supply design', 'Cost analysis', 'Safety planning'],
    derivedFrom: 'Energy per unit time',
    relatedFormulas: ['ohms_law', 'energy_cost', 'efficiency']
  },
  {
    id: 'resistors_series',
    name: 'Resistors in Series',
    formula: 'R_total = R₁ + R₂ + R₃ + ...',
    variables: [
      { symbol: 'R_total', description: 'Total resistance', unit: 'Ohms (Ω)' },
      { symbol: 'R₁, R₂, R₃', description: 'Individual resistances', unit: 'Ohms (Ω)' }
    ],
    category: 'physics',
    description: 'Total resistance when resistors are connected end-to-end',
    usage: 'Use when resistors are connected in a single path. Current is same through all resistors.',
    example: 'Three resistors in series: 10Ω, 20Ω, 30Ω\nR_total = 10 + 20 + 30 = 60Ω',
    practicalExample: 'Christmas light string: 50 bulbs, each 2.4Ω, connected in series\nTotal resistance = 50 × 2.4 = 120Ω\nWith 120V supply: Current = 120V/120Ω = 1A\nEach bulb gets: 120V/50 = 2.4V',
    notes: [
      'Current is the same through all resistors',
      'Voltages add up to total voltage',
      'Total resistance is always greater than largest individual resistance',
      'If one component fails, entire circuit breaks'
    ],
    difficulty: 'basic',
    applications: ['Circuit design', 'Voltage dividers', 'Current limiting', 'LED arrays', 'Sensor circuits']
  },
  {
    id: 'resistors_parallel',
    name: 'Resistors in Parallel',
    formula: '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...',
    variables: [
      { symbol: 'R_total', description: 'Total resistance', unit: 'Ohms (Ω)' },
      { symbol: 'R₁, R₂, R₃', description: 'Individual resistances', unit: 'Ohms (Ω)' }
    ],
    category: 'physics',
    description: 'Total resistance when resistors are connected side-by-side',
    usage: 'Use when resistors are connected across same voltage. Voltage is same across all resistors.',
    example: 'Two resistors in parallel: 6Ω and 12Ω\n1/R_total = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4\nR_total = 4Ω',
    practicalExample: 'Home electrical outlets: Multiple devices plugged into outlets\nEach device sees 120V regardless of others\nToaster (10Ω) and lamp (240Ω) in parallel:\n1/R_total = 1/10 + 1/240 = 24/240 + 1/240 = 25/240\nR_total = 9.6Ω',
    notes: [
      'Voltage is the same across all resistors',
      'Currents add up to total current',
      'Total resistance is always less than smallest individual resistance',
      'Components can operate independently'
    ],
    difficulty: 'intermediate',
    applications: ['Household wiring', 'Power distribution', 'Circuit protection', 'Current sharing', 'Backup systems']
  },

  // Chemistry
  {
    id: 'ideal_gas',
    name: 'Ideal Gas Law',
    formula: 'PV = nRT',
    variables: [
      { symbol: 'P', description: 'Pressure', unit: 'atm, Pa, or mmHg' },
      { symbol: 'V', description: 'Volume', unit: 'L or m³' },
      { symbol: 'n', description: 'Amount of gas', unit: 'moles' },
      { symbol: 'R', description: 'Gas constant', unit: '0.0821 L⋅atm/(mol⋅K)' },
      { symbol: 'T', description: 'Temperature', unit: 'Kelvin (K)' }
    ],
    category: 'chemistry',
    description: 'Describes the relationship between pressure, volume, temperature, and amount of gas',
    usage: 'Use for gas calculations at standard conditions. Essential for chemical engineering, weather prediction, and gas storage.',
    example: 'Find pressure of 2 moles of gas at 300K in 10L container:\nP = nRT/V = (2)(0.0821)(300)/10 = 4.926 atm',
    practicalExample: 'Scuba tank design: 80 cubic feet tank at 3000 psi, room temperature (298K)\nConvert: V = 80 ft³ = 2265 L, P = 3000 psi = 204 atm\nn = PV/RT = (204)(2265)/(0.0821)(298) = 18,900 moles of air\nThat\'s about 537 grams of air!',
    notes: [
      'Temperature MUST be in Kelvin: K = °C + 273.15',
      'Assumes ideal gas behavior (good approximation at standard conditions)',
      'Use consistent units for R value',
      'Real gases deviate at high pressure or low temperature'
    ],
    difficulty: 'intermediate',
    applications: ['Chemical engineering', 'Weather prediction', 'Scuba diving', 'Industrial processes', 'Gas storage'],
    relatedFormulas: ['combined_gas_law', 'boyles_law', 'charles_law']
  },
  {
    id: 'molarity',
    name: 'Molarity',
    formula: 'M = n/V',
    variables: [
      { symbol: 'M', description: 'Molarity (concentration)', unit: 'mol/L or M' },
      { symbol: 'n', description: 'Moles of solute', unit: 'mol' },
      { symbol: 'V', description: 'Volume of solution', unit: 'L' }
    ],
    category: 'chemistry',
    description: 'Concentration of a solution expressed as moles of solute per liter of solution',
    usage: 'Essential for solution preparation, dilution calculations, and stoichiometry problems in chemistry.',
    example: 'Dissolve 0.5 moles NaCl in water to make 2L solution:\nM = 0.5 mol / 2L = 0.25 M',
    practicalExample: 'Laboratory: Prepare 500 mL of 0.1 M NaOH solution\nMoles needed = M × V = 0.1 mol/L × 0.5 L = 0.05 mol\nMass needed = 0.05 mol × 40 g/mol = 2.0 g NaOH\nDissolve 2.0 g NaOH in water, dilute to exactly 500 mL',
    notes: [
      'Volume refers to final solution volume, not solvent volume',
      'Temperature affects volume, so molarity changes with temperature',
      'For dilutions: M₁V₁ = M₂V₂',
      'Alternative concentration units: molality (m), normality (N)'
    ],
    difficulty: 'intermediate',
    applications: ['Solution preparation', 'Analytical chemistry', 'Pharmaceutical industry', 'Quality control', 'Research'],
    relatedFormulas: ['dilution_formula', 'molality', 'percent_concentration']
  },
  {
    id: 'ph_calculation',
    name: 'pH Calculation',
    formula: 'pH = -log[H⁺]',
    variables: [
      { symbol: 'pH', description: 'Acidity scale', unit: 'unitless (0-14)' },
      { symbol: '[H⁺]', description: 'Hydrogen ion concentration', unit: 'mol/L' },
      { symbol: 'log', description: 'Base-10 logarithm', unit: 'unitless' }
    ],
    category: 'chemistry',
    description: 'Measures the acidity or basicity of a solution',
    usage: 'Essential for water quality, chemical processes, biological systems, and environmental monitoring.',
    example: 'Solution with [H⁺] = 1 × 10⁻³ M:\npH = -log(1 × 10⁻³) = -(-3) = 3 (acidic)',
    practicalExample: 'Swimming pool maintenance: Pool water has [H⁺] = 3.2 × 10⁻⁸ M\npH = -log(3.2 × 10⁻⁸) = -(log(3.2) + log(10⁻⁸)) = -(0.51 - 8) = 7.49\nSlightly basic, within acceptable range (7.2-7.8)',
    notes: [
      'pH < 7: acidic, pH = 7: neutral, pH > 7: basic',
      'Each pH unit represents 10× change in [H⁺]',
      'pOH = -log[OH⁻], and pH + pOH = 14 at 25°C',
      'Use calibrated pH meter for accurate measurements'
    ],
    difficulty: 'intermediate',
    applications: ['Water treatment', 'Food industry', 'Medicine', 'Environmental monitoring', 'Agriculture'],
    relatedFormulas: ['poh_calculation', 'henderson_hasselbalch', 'buffer_calculations']
  },
  {
    id: 'boyles_law',
    name: "Boyle's Law",
    formula: 'P₁V₁ = P₂V₂',
    variables: [
      { symbol: 'P₁, P₂', description: 'Initial and final pressure', unit: 'atm, Pa, or mmHg' },
      { symbol: 'V₁, V₂', description: 'Initial and final volume', unit: 'L or m³' }
    ],
    category: 'chemistry',
    description: 'At constant temperature, pressure and volume are inversely proportional',
    usage: 'Use when temperature and amount of gas remain constant. Essential for understanding gas compression and expansion.',
    example: 'Gas at 2 atm occupies 5L. Find volume at 10 atm:\nP₁V₁ = P₂V₂ → 2 × 5 = 10 × V₂\nV₂ = 10/10 = 1L',
    practicalExample: 'Scuba diving: Air bubble at 30 ft depth (2 atm) has volume 1 mL\nAt surface (1 atm): V₂ = P₁V₁/P₂ = (2)(1)/1 = 2 mL\nBubble doubles in size - why divers must exhale when ascending!',
    notes: [
      'Temperature must remain constant',
      'Amount of gas (moles) must remain constant',
      'Pressure increases → volume decreases',
      'Product PV is constant for isothermal process'
    ],
    difficulty: 'basic',
    applications: ['Scuba diving', 'Gas compression', 'Pneumatic systems', 'Balloon physics', 'Engine design']
  },
  {
    id: 'charles_law',
    name: "Charles's Law",
    formula: 'V₁/T₁ = V₂/T₂',
    variables: [
      { symbol: 'V₁, V₂', description: 'Initial and final volume', unit: 'L or m³' },
      { symbol: 'T₁, T₂', description: 'Initial and final temperature', unit: 'Kelvin (K)' }
    ],
    category: 'chemistry',
    description: 'At constant pressure, volume and temperature are directly proportional',
    usage: 'Use when pressure and amount of gas remain constant. Essential for understanding thermal expansion of gases.',
    example: 'Gas at 300K occupies 2L. Find volume at 600K:\nV₁/T₁ = V₂/T₂ → 2/300 = V₂/600\nV₂ = (2 × 600)/300 = 4L',
    practicalExample: 'Hot air balloon: Air heated from 20°C (293K) to 80°C (353K)\nVolume change: V₂/V₁ = T₂/T₁ = 353/293 = 1.20\nAir expands by 20%, decreasing density and creating lift!',
    notes: [
      'Temperature MUST be in Kelvin',
      'Pressure must remain constant',
      'Amount of gas (moles) must remain constant',
      'Volume increases linearly with absolute temperature'
    ],
    difficulty: 'basic',
    applications: ['Hot air balloons', 'Thermal expansion', 'HVAC systems', 'Engine design', 'Weather analysis']
  },
  {
    id: 'avogadros_number',
    name: "Avogadro's Number",
    formula: 'N = n × Nₐ',
    variables: [
      { symbol: 'N', description: 'Number of particles' },
      { symbol: 'n', description: 'Number of moles', unit: 'mol' },
      { symbol: 'Nₐ', description: "Avogadro's number", unit: '6.022 × 10²³ mol⁻¹' }
    ],
    category: 'chemistry',
    description: 'Converts between moles and number of atoms/molecules',
    usage: 'Essential for counting atoms and molecules, understanding molecular scale, and stoichiometry calculations.',
    example: '2 moles of carbon atoms:\nN = 2 × 6.022 × 10²³ = 1.204 × 10²⁴ atoms',
    practicalExample: 'Water molecule count: 18g of water (1 mole H₂O)\nNumber of molecules = 1 × 6.022 × 10²³ = 6.022 × 10²³ molecules\nNumber of atoms = 6.022 × 10²³ × 3 = 1.807 × 10²⁴ atoms (2H + 1O per molecule)',
    notes: [
      'One mole contains exactly 6.022 × 10²³ particles',
      'Applies to atoms, molecules, ions, electrons, etc.',
      'Molar mass in grams contains Avogadro\'s number of particles',
      'Bridge between atomic and macroscopic scales'
    ],
    difficulty: 'basic',
    applications: ['Stoichiometry', 'Molecular counting', 'Chemical analysis', 'Material science', 'Pharmaceutical calculations']
  },

  // Statistics - Extended
  {
    id: 'mean',
    name: 'Arithmetic Mean',
    formula: 'x̄ = Σx / n',
    variables: [
      { symbol: 'x̄', description: 'Sample mean' },
      { symbol: 'Σx', description: 'Sum of all values' },
      { symbol: 'n', description: 'Number of values' }
    ],
    category: 'statistics',
    description: 'Average value of a dataset',
    usage: 'Most common measure of central tendency. Use when data is relatively symmetric without extreme outliers.',
    example: 'Test scores: 85, 92, 78, 96, 89\nx̄ = (85+92+78+96+89)/5 = 440/5 = 88',
    practicalExample: 'Quality control: Bolt lengths (mm): 25.1, 24.9, 25.2, 24.8, 25.0, 25.1, 24.9\nMean = (25.1+24.9+25.2+24.8+25.0+25.1+24.9)/7 = 175.0/7 = 25.0 mm\nPerfect! Target length achieved on average.',
    notes: [
      'Sensitive to outliers (extreme values)',
      'For skewed data, consider median instead',
      'Population mean uses μ (mu) symbol',
      'Can be weighted: x̄ = Σ(w·x)/Σw'
    ],
    difficulty: 'basic',
    applications: ['Quality control', 'Grade calculations', 'Performance metrics', 'Market research', 'Scientific analysis'],
    relatedFormulas: ['median', 'mode', 'standard_deviation']
  },
  {
    id: 'median',
    name: 'Median',
    formula: 'Middle value when data is ordered',
    variables: [
      { symbol: 'n', description: 'Number of values' },
      { symbol: 'x₍ₙ₊₁₎/₂', description: 'Middle position (odd n)' },
      { symbol: '(xₙ/₂ + x₍ₙ/₂₊₁₎)/2', description: 'Average of middle two (even n)' }
    ],
    category: 'statistics',
    description: 'Middle value that separates the higher half from the lower half of data',
    usage: 'Better than mean for skewed data or when outliers are present. Used in income statistics and robust analysis.',
    example: 'Data: 3, 7, 8, 10, 15 (odd n=5)\nMedian = middle value = 8\nData: 2, 5, 8, 12 (even n=4)\nMedian = (5+8)/2 = 6.5',
    practicalExample: 'House prices in neighborhood: $150k, $180k, $200k, $220k, $850k\nMean = $320k (influenced by expensive house)\nMedian = $200k (better represents typical price)\nMedian less affected by the $850k outlier',
    notes: [
      'Not affected by extreme values (outliers)',
      'Always a value that could exist in the dataset',
      'For continuous data, 50% of values below median',
      'Works well with ordinal (ranked) data'
    ],
    difficulty: 'basic',
    applications: ['Income analysis', 'Real estate', 'Survey data', 'Quality control', 'Robust statistics']
  },
  {
    id: 'standard_deviation',
    name: 'Standard Deviation',
    formula: 's = √[Σ(x - x̄)²/(n-1)]',
    variables: [
      { symbol: 's', description: 'Sample standard deviation' },
      { symbol: 'x', description: 'Individual values' },
      { symbol: 'x̄', description: 'Sample mean' },
      { symbol: 'n', description: 'Sample size' }
    ],
    category: 'statistics',
    description: 'Measures the spread or variability of data around the mean',
    usage: 'Essential for understanding data variability, quality control, risk assessment, and comparing datasets.',
    example: 'Data: 2, 4, 6, 8, 10 (mean = 6)\nDeviations: -4, -2, 0, 2, 4\nSquared: 16, 4, 0, 4, 16\nVariance = (16+4+0+4+16)/(5-1) = 40/4 = 10\nStd dev = √10 ≈ 3.16',
    practicalExample: 'Manufacturing quality: Target thickness 5.0mm\nSample A: 4.8, 5.0, 5.2 mm → std dev = 0.2mm\nSample B: 4.5, 5.0, 5.5 mm → std dev = 0.5mm\nSample A has better consistency (lower variability)',
    notes: [
      'Use n-1 for sample std dev (Bessel\'s correction)',
      'Use n for population std dev (σ)',
      'About 68% of data within 1 std dev of mean (normal distribution)',
      'About 95% within 2 std devs, 99.7% within 3 std devs'
    ],
    difficulty: 'intermediate',
    applications: ['Quality control', 'Risk analysis', 'Scientific research', 'Finance', 'Psychology'],
    relatedFormulas: ['variance', 'coefficient_variation', 'normal_distribution']
  },
  {
    id: 'variance',
    name: 'Variance',
    formula: 's² = Σ(x - x̄)²/(n-1)',
    variables: [
      { symbol: 's²', description: 'Sample variance' },
      { symbol: 'x', description: 'Individual values' },
      { symbol: 'x̄', description: 'Sample mean' },
      { symbol: 'n', description: 'Sample size' }
    ],
    category: 'statistics',
    description: 'Measures the average squared deviation from the mean',
    usage: 'Fundamental measure of spread. Standard deviation is square root of variance. Used in ANOVA and regression.',
    example: 'Data: 1, 3, 5, 7, 9 (mean = 5)\nDeviations: -4, -2, 0, 2, 4\nSquared deviations: 16, 4, 0, 4, 16\nVariance = (16+4+0+4+16)/(5-1) = 40/4 = 10',
    practicalExample: 'Investment returns: Portfolio A has std dev = 5%, Portfolio B has std dev = 10%\nVariance A = (5%)² = 25%²\nVariance B = (10%)² = 100%²\nPortfolio B has 4× more variance (much more risky)',
    notes: [
      'Units are squared (length², dollars², etc.)',
      'Always non-negative',
      'Variance of sum: Var(X+Y) = Var(X) + Var(Y) + 2Cov(X,Y)',
      'Sample variance uses n-1 denominator'
    ],
    difficulty: 'intermediate',
    applications: ['Risk measurement', 'Quality control', 'ANOVA', 'Portfolio theory', 'Signal processing']
  },
  {
    id: 'correlation',
    name: 'Pearson Correlation Coefficient',
    formula: 'r = Σ[(x-x̄)(y-ȳ)] / √[Σ(x-x̄)²Σ(y-ȳ)²]',
    variables: [
      { symbol: 'r', description: 'Correlation coefficient', unit: '-1 to +1' },
      { symbol: 'x, y', description: 'Data pairs' },
      { symbol: 'x̄, ȳ', description: 'Means of x and y' }
    ],
    category: 'statistics',
    description: 'Measures the strength and direction of linear relationship between two variables',
    usage: 'Determine if two variables are related, assess prediction accuracy, validate models, analyze cause-effect relationships.',
    example: 'Height vs Weight data for 5 people:\nHeights: 160, 165, 170, 175, 180 cm\nWeights: 55, 62, 68, 75, 82 kg\nCalculation shows r ≈ 0.98 (strong positive correlation)',
    practicalExample: 'Marketing analysis: Advertising spend vs Sales\nWeek 1: $1000 → $5000 sales\nWeek 2: $1500 → $7200 sales\nWeek 3: $2000 → $9100 sales\nWeek 4: $2500 → $11000 sales\nCorrelation r ≈ 0.99 indicates strong relationship',
    notes: [
      'r = +1: perfect positive correlation',
      'r = -1: perfect negative correlation', 
      'r = 0: no linear correlation',
      'Correlation ≠ causation!'
    ],
    difficulty: 'advanced',
    applications: ['Market research', 'Scientific studies', 'Quality analysis', 'Financial modeling', 'Medical research'],
    relatedFormulas: ['regression_line', 'coefficient_determination']
  },
  {
    id: 'normal_distribution',
    name: 'Normal Distribution',
    formula: 'f(x) = (1/(σ√2π)) × e^(-½((x-μ)/σ)²)',
    variables: [
      { symbol: 'f(x)', description: 'Probability density' },
      { symbol: 'μ', description: 'Mean', unit: 'same as x' },
      { symbol: 'σ', description: 'Standard deviation', unit: 'same as x' },
      { symbol: 'π', description: 'Pi (≈ 3.14159)', unit: 'unitless' },
      { symbol: 'e', description: 'Euler\'s number (≈ 2.718)', unit: 'unitless' }
    ],
    category: 'statistics',
    description: 'Bell-shaped probability distribution that describes many natural phenomena',
    usage: 'Model natural variations, quality control limits, hypothesis testing, and confidence intervals.',
    example: 'IQ scores: μ = 100, σ = 15\nProbability density at IQ = 115:\nf(115) = (1/(15√2π)) × e^(-½((115-100)/15)²)\n≈ 0.0266 × e^(-0.5) ≈ 0.0161',
    practicalExample: 'Manufacturing: Bolt lengths normally distributed, μ = 50mm, σ = 0.5mm\n68% of bolts: 49.5-50.5mm (within 1σ)\n95% of bolts: 49.0-51.0mm (within 2σ)\n99.7% of bolts: 48.5-51.5mm (within 3σ)',
    notes: [
      'Symmetric around the mean',
      '68-95-99.7 rule for 1, 2, 3 standard deviations',
      'Mean = median = mode',
      'Many real-world phenomena follow normal distribution'
    ],
    difficulty: 'advanced',
    applications: ['Quality control', 'Hypothesis testing', 'Natural sciences', 'Psychology', 'Economics']
  },

  // Finance - Extended
  {
    id: 'compound_interest',
    name: 'Compound Interest',
    formula: 'A = P(1 + r/n)^(nt)',
    variables: [
      { symbol: 'A', description: 'Final amount', unit: 'currency' },
      { symbol: 'P', description: 'Principal (initial amount)', unit: 'currency' },
      { symbol: 'r', description: 'Annual interest rate', unit: 'decimal' },
      { symbol: 'n', description: 'Compounding frequency per year' },
      { symbol: 't', description: 'Time', unit: 'years' }
    ],
    category: 'finance',
    description: 'Calculates compound interest where interest earns interest',
    usage: 'Essential for investment planning, loan calculations, retirement planning, and understanding the time value of money.',
    example: '$1000 invested at 5% annual rate, compounded quarterly for 3 years:\nA = 1000(1 + 0.05/4)^(4×3) = 1000(1.0125)^12 = $1161.62',
    practicalExample: 'Retirement savings: $500/month for 30 years at 7% annual return\nUsing monthly compounding: A = 500 × [((1+0.07/12)^360 - 1)/(0.07/12)]\nTotal ≈ $566,764 (contributed $180,000, earned $386,764 in interest!)',
    notes: [
      'More frequent compounding = higher returns',
      'Continuous compounding: A = Pe^(rt)',
      'Rule of 72: Years to double ≈ 72/interest_rate',
      'Start early - compound growth is exponential'
    ],
    difficulty: 'intermediate',
    applications: ['Investment planning', 'Retirement calculations', 'Loan analysis', 'Financial planning', 'Economic modeling'],
    relatedFormulas: ['simple_interest', 'present_value', 'annuity_formula']
  },
  {
    id: 'simple_interest',
    name: 'Simple Interest',
    formula: 'I = Prt',
    variables: [
      { symbol: 'I', description: 'Interest earned', unit: 'currency' },
      { symbol: 'P', description: 'Principal amount', unit: 'currency' },
      { symbol: 'r', description: 'Annual interest rate', unit: 'decimal' },
      { symbol: 't', description: 'Time', unit: 'years' }
    ],
    category: 'finance',
    description: 'Calculates interest that does not compound',
    usage: 'Used for basic interest calculations, some loans, and as foundation for understanding compound interest.',
    example: '$2000 at 6% simple interest for 4 years:\nI = 2000 × 0.06 × 4 = $480\nTotal amount = $2000 + $480 = $2480',
    practicalExample: 'Short-term loan: Borrow $5000 at 8% simple interest for 6 months\nI = 5000 × 0.08 × 0.5 = $200\nTotal repayment = $5000 + $200 = $5200',
    notes: [
      'Interest calculated only on principal',
      'Linear growth (straight line)',
      'Less realistic for long-term investments',
      'Easy to calculate mentally'
    ],
    difficulty: 'basic',
    applications: ['Short-term loans', 'Basic calculations', 'Educational examples', 'Quick estimates', 'Some bond calculations']
  },
  {
    id: 'present_value',
    name: 'Present Value',
    formula: 'PV = FV / (1 + r)^t',
    variables: [
      { symbol: 'PV', description: 'Present value', unit: 'currency' },
      { symbol: 'FV', description: 'Future value', unit: 'currency' },
      { symbol: 'r', description: 'Discount rate', unit: 'decimal' },
      { symbol: 't', description: 'Time periods', unit: 'years' }
    ],
    category: 'finance',
    description: 'Current worth of a future sum of money given a specified rate of return',
    usage: 'Essential for investment analysis, loan decisions, comparing financial options, and capital budgeting.',
    example: 'What is $5000 received in 5 years worth today at 8% discount rate?\nPV = 5000 / (1 + 0.08)^5 = 5000 / 1.469 = $3,403',
    practicalExample: 'Business decision: Receive $10,000 now or $15,000 in 4 years?\nAt 6% opportunity cost: PV = 15,000 / (1.06)^4 = 15,000 / 1.262 = $11,881\nTake the future payment - it\'s worth $11,881 vs $10,000 today',
    notes: [
      'Higher discount rate = lower present value',
      'Time value of money: dollar today worth more than dollar tomorrow',
      'Use for comparing cash flows at different times',
      'Consider inflation and opportunity cost in discount rate'
    ],
    difficulty: 'intermediate',
    applications: ['Investment analysis', 'Capital budgeting', 'Loan decisions', 'Insurance', 'Real estate'],
    relatedFormulas: ['future_value', 'net_present_value', 'annuity_present_value']
  },
  {
    id: 'future_value',
    name: 'Future Value',
    formula: 'FV = PV(1 + r)^t',
    variables: [
      { symbol: 'FV', description: 'Future value', unit: 'currency' },
      { symbol: 'PV', description: 'Present value', unit: 'currency' },
      { symbol: 'r', description: 'Interest rate', unit: 'decimal' },
      { symbol: 't', description: 'Time periods', unit: 'years' }
    ],
    category: 'finance',
    description: 'Value of current money at a specified date in the future based on assumed growth rate',
    usage: 'Calculate how much current investments will be worth in the future. Essential for retirement and investment planning.',
    example: '$3000 invested at 7% for 10 years:\nFV = 3000(1 + 0.07)^10 = 3000(1.967) = $5,901',
    practicalExample: 'College fund: Save $200/month for 18 years at 6% annual return\nMonthly rate = 6%/12 = 0.5%\nFV = 200 × [((1.005)^216 - 1)/0.005] = 200 × 394.5 = $78,900\nContributed: $200 × 216 = $43,200, Earned: $35,700',
    notes: [
      'Inverse of present value formula',
      'Shows power of compound growth',
      'Higher rate or longer time = much higher future value',
      'Use for goal setting and planning'
    ],
    difficulty: 'basic',
    applications: ['Retirement planning', 'Investment goals', 'Education funding', 'Savings targets', 'Financial planning']
  },
  {
    id: 'annuity_present_value',
    name: 'Annuity Present Value',
    formula: 'PV = PMT × [(1 - (1 + r)^(-n))/r]',
    variables: [
      { symbol: 'PV', description: 'Present value of annuity', unit: 'currency' },
      { symbol: 'PMT', description: 'Periodic payment', unit: 'currency' },
      { symbol: 'r', description: 'Interest rate per period', unit: 'decimal' },
      { symbol: 'n', description: 'Number of payments' }
    ],
    category: 'finance',
    description: 'Present value of a series of equal payments made at regular intervals',
    usage: 'Calculate loan amounts, pension values, lease payments, and structured settlements.',
    example: 'Monthly payments of $500 for 5 years at 6% annual rate:\nr = 6%/12 = 0.5% per month, n = 60 payments\nPV = 500 × [(1 - (1.005)^(-60))/0.005] = 500 × 51.73 = $25,865',
    practicalExample: 'Lottery choice: $50,000/year for 20 years OR $600,000 lump sum\nUsing 5% discount rate:\nPV = 50,000 × [(1 - (1.05)^(-20))/0.05] = 50,000 × 12.46 = $623,000\nTake the annuity - it\'s worth more!',
    notes: [
      'Assumes payments made at end of each period',
      'Annuity due formula different (payments at beginning)',
      'Higher interest rate = lower present value',
      'Used extensively in loan and pension calculations'
    ],
    difficulty: 'advanced',
    applications: ['Loan calculations', 'Pension planning', 'Lease analysis', 'Structured settlements', 'Bond valuation']
  },

  // Calculus - New Category
  {
    id: 'derivative_power_rule',
    name: 'Power Rule for Derivatives',
    formula: 'd/dx[x^n] = nx^(n-1)',
    variables: [
      { symbol: 'n', description: 'Exponent (any real number)' },
      { symbol: 'x', description: 'Variable' }
    ],
    category: 'calculus',
    description: 'Rule for finding derivatives of power functions',
    usage: 'Most basic differentiation rule. Use for polynomials, roots, and rational functions.',
    example: 'd/dx[x³] = 3x²\nd/dx[x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x)\nd/dx[1/x²] = d/dx[x^(-2)] = -2x^(-3) = -2/x³',
    practicalExample: 'Projectile motion: height h(t) = -16t² + 64t + 80\nVelocity = dh/dt = d/dt[-16t² + 64t + 80] = -32t + 64\nAt t = 1 second: velocity = -32(1) + 64 = 32 ft/s upward',
    notes: [
      'Works for any real number exponent',
      'For x^0 = 1: derivative is 0 (constant rule)',
      'For negative exponents: brings power down and subtracts 1',
      'Foundation for most other differentiation techniques'
    ],
    difficulty: 'basic',
    applications: ['Physics (velocity, acceleration)', 'Economics (marginal cost)', 'Engineering optimization', 'Population dynamics', 'Geometry (tangent lines)']
  },
  {
    id: 'integral_power_rule',
    name: 'Power Rule for Integration',
    formula: '∫x^n dx = x^(n+1)/(n+1) + C',
    variables: [
      { symbol: 'n', description: 'Exponent (n ≠ -1)' },
      { symbol: 'x', description: 'Variable' },
      { symbol: 'C', description: 'Constant of integration' }
    ],
    category: 'calculus',
    description: 'Rule for finding antiderivatives of power functions',
    usage: 'Basic integration rule for polynomials and power functions. Remember to add constant of integration.',
    example: '∫x³ dx = x⁴/4 + C\n∫√x dx = ∫x^(1/2) dx = x^(3/2)/(3/2) + C = (2/3)x^(3/2) + C\n∫1/x² dx = ∫x^(-2) dx = x^(-1)/(-1) + C = -1/x + C',
    practicalExample: 'Area under curve: Find area under y = x² from x = 0 to x = 3\n∫₀³ x² dx = [x³/3]₀³ = 3³/3 - 0³/3 = 27/3 = 9 square units',
    notes: [
      'Add 1 to exponent, then divide by new exponent',
      'Does NOT work for n = -1 (use ln|x| instead)',
      'Always add constant C for indefinite integrals',
      'Reverse process of power rule for derivatives'
    ],
    difficulty: 'basic',
    applications: ['Area calculations', 'Physics (distance from velocity)', 'Probability', 'Economics (total cost from marginal cost)', 'Engineering']
  }
];

const FormulaReference = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'mathematics', name: 'Mathematics', icon: Calculator },
    { id: 'physics', name: 'Physics', icon: Zap },
    { id: 'chemistry', name: 'Chemistry', icon: Beaker },
    { id: 'statistics', name: 'Statistics', icon: Calculator },
    { id: 'geometry', name: 'Geometry', icon: Calculator },
    { id: 'trigonometry', name: 'Trigonometry', icon: Calculator },
    { id: 'calculus', name: 'Calculus', icon: Calculator },
    { id: 'finance', name: 'Finance', icon: Calculator }
  ];

  const filteredFormulas = useMemo(() => {
    return formulas.filter(formula => {
      const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formula.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || formula.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    toast.success('Formula copied to clipboard!');
  };

  const toggleFavorite = (formulaId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(formulaId)) {
      newFavorites.delete(formulaId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(formulaId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(cat => cat.id === category);
    return categoryInfo ? categoryInfo.icon : BookOpen;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* SEO Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Complete Formula Reference Guide
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Master mathematics, physics, chemistry, statistics, and calculus with our comprehensive formula database. 
          Each formula includes detailed explanations, practical examples, and real-world applications.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">80+ Formulas</Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Step-by-Step Examples</Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">Real Applications</Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pro Tips</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            Find Your Formula
          </CardTitle>
          <CardDescription>
            Search by formula name, variables, or real-world applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search formulas, applications, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-lg py-3"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border rounded-md bg-background min-w-[140px]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border rounded-md bg-background min-w-[120px]"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Found {filteredFormulas.length} formula{filteredFormulas.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Formula Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFormulas.map((formula) => {
          const CategoryIcon = getCategoryIcon(formula.category);
          const isExpanded = expandedFormula === formula.id;
          
          return (
            <Card key={formula.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">{formula.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {formula.category}
                        </Badge>
                        <Badge className={getDifficultyColor(formula.difficulty)}>
                          {formula.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(formula.id)}
                    className="p-2"
                  >
                    <Star 
                      className={`h-5 w-5 ${favorites.has(formula.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Formula Display */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold text-blue-800">Formula</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyFormula(formula.formula)}
                      className="h-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-center py-2 bg-white rounded border">
                    {formula.formula}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Description</Label>
                  <p className="text-sm mt-1 text-gray-600">{formula.description}</p>
                </div>

                {/* Variables */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Variables</Label>
                  <div className="bg-gray-50 p-3 rounded mt-1">
                    {formula.variables.map((variable, index) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="font-mono font-bold text-blue-600">{variable.symbol}:</span>
                        <span className="text-sm text-gray-600 flex-1 ml-3">{variable.description}</span>
                        {variable.unit && (
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">({variable.unit})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage */}
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-semibold text-blue-800">How to Use</Label>
                  </div>
                  <p className="text-sm text-blue-700">{formula.usage}</p>
                </div>

                {/* Expand/Collapse Button */}
                <Button
                  variant="outline"
                  onClick={() => setExpandedFormula(isExpanded ? null : formula.id)}
                  className="w-full"
                >
                  {isExpanded ? 'Show Less' : 'Show Examples & Applications'}
                </Button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Basic Example */}
                    <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                      <Label className="text-sm font-semibold text-green-800 mb-2 block">
                        📝 Basic Example
                      </Label>
                      <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                        {formula.example}
                      </pre>
                    </div>

                    {/* Practical Example */}
                    <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                      <Label className="text-sm font-semibold text-purple-800 mb-2 block">
                        🎯 Real-World Application
                      </Label>
                      <pre className="text-sm text-purple-700 whitespace-pre-wrap bg-white p-3 rounded border">
                        {formula.practicalExample}
                      </pre>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <Label className="text-sm font-semibold text-yellow-800">Important Notes</Label>
                      </div>
                      <ul className="space-y-2">
                        {formula.notes.map((note, index) => (
                          <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                            <span className="text-yellow-500 font-bold">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Applications */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-gray-600" />
                        <Label className="text-sm font-semibold text-gray-700">Applications</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formula.applications.map((app, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Related Formulas */}
                    {formula.relatedFormulas && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Related Formulas
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {formula.relatedFormulas.map((related, index) => (
                            <Badge key={index} variant="outline" className="text-xs cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                const relatedFormula = formulas.find(f => f.id === related);
                                if (relatedFormula) {
                                  setSearchTerm(relatedFormula.name);
                                  setExpandedFormula(null);
                                }
                              }}>
                              {formulas.find(f => f.id === related)?.name || related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No formulas found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSelectedDifficulty('all');
          }}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Study Guide */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Master These Formulas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-white">🎯 Study Strategy</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Start with basic formulas in your subject area</li>
                <li>• Practice with the provided examples</li>
                <li>• Work through real-world applications</li>
                <li>• Use favorites to track your progress</li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-white">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Understand when to use each formula</li>
                <li>• Check units and dimensional analysis</li>
                <li>• Look for patterns between related formulas</li>
                <li>• Practice mental estimation for reasonableness</li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-white">🔍 Problem-Solving</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Identify what you know and what you need</li>
                <li>• Choose the appropriate formula</li>
                <li>• Substitute values carefully</li>
                <li>• Verify your answer makes sense</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormulaReference;
