'use client';

import { useState, useEffect, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const operations = [
  { symbol: '+', name: 'addition' },
  { symbol: '-', name: 'subtraction' },
  { symbol: '×', name: 'multiplication' }
];

interface SimpleCaptchaProps {
  onValidationChange: (isValid: boolean) => void;
  reset?: boolean;
}

const SimpleCaptcha = ({ onValidationChange, reset }: SimpleCaptchaProps) => {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [operation, setOperation] = useState<string>('+');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const generateNumbers = useCallback(() => {
    const selectedOp = operations[Math.floor(Math.random() * operations.length)];
    setOperation(selectedOp.symbol);
    
    let n1, n2;
    
    if (selectedOp.symbol === '+') {
      // Addition: 10-50 + 5-25
      n1 = Math.floor(Math.random() * 41) + 10;
      n2 = Math.floor(Math.random() * 21) + 5;
    } else if (selectedOp.symbol === '-') {
      // Subtraction: ensure positive result
      n1 = Math.floor(Math.random() * 41) + 20; // 20-60
      n2 = Math.floor(Math.random() * (n1 - 5)) + 1; // 1 to (n1-5)
    } else {
      // Multiplication: small numbers
      n1 = Math.floor(Math.random() * 9) + 2; // 2-10
      n2 = Math.floor(Math.random() * 9) + 2; // 2-10
    }
    
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsValid(false);
  }, []);

  const calculateCorrectAnswer = useCallback(() => {
    switch (operation) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '×':
        return num1 * num2;
      default:
        return 0;
    }
  }, [operation, num1, num2]);

  useEffect(() => {
    generateNumbers();
  }, [reset, generateNumbers]);

  useEffect(() => {
    const correctAnswer = calculateCorrectAnswer();
    const valid = parseInt(userAnswer) === correctAnswer && userAnswer !== '';
    setIsValid(valid);
    onValidationChange(valid);
  }, [userAnswer, num1, num2, operation, onValidationChange, calculateCorrectAnswer]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const getOperationText = () => {
    switch (operation) {
      case '+':
        return 'plus';
      case '-':
        return 'minus';
      case '×':
        return 'times';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">Security Check</Label>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-mono bg-muted px-3 py-2 rounded border min-w-[120px] text-center">
          {num1} {operation} {num2} = ?
        </span>
        <Input
          id="captcha"
          type="number"
          placeholder="Answer"
          value={userAnswer}
          onChange={handleAnswerChange}
          className={`w-24 ${isValid ? 'border-green-500' : userAnswer ? 'border-red-500' : ''}`}
          required
        />
        <button
          type="button"
          onClick={generateNumbers}
          className="text-sm text-muted-foreground hover:text-primary p-1"
          title="Generate new question"
        >
          🔄
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        What is {num1} {getOperationText()} {num2}?
      </p>
      {userAnswer && !isValid && (
        <p className="text-sm text-destructive">Incorrect answer. Please try again.</p>
      )}
    </div>
  );
};

export default SimpleCaptcha;
