import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

interface SixDigitCodeInputProps {
  verifyCode: (code: string) => Promise<void> | void;  // Support async verification
}

export default function SixDigitCodeInput({ verifyCode }: SixDigitCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value;
    // Allow only a single digit 0-9 or empty string
    if (!/^\d?$/.test(val)) return;

    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    // Reject paste if any non-digit found
    if (!pasteData.every((c) => /^\d$/.test(c))) return;

    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasteData[i] || "";
      if (inputsRef.current[i]) inputsRef.current[i]!.value = newCode[i];
    }
    setCode(newCode);
    if (pasteData.length < 6) {
      inputsRef.current[pasteData.length]?.focus();
    } else {
      inputsRef.current[5]?.focus();
    }
  };

  const joinedCode = code.join("");

  // On verify, disable button and clear code on failure or success for security
  const onVerifyClick = async () => {
    if (joinedCode.length < 6 || isVerifying) return;

    setIsVerifying(true);
    try {
      await verifyCode(joinedCode);
      // On success, clear code for security
      setCode(Array(6).fill(""));
    } catch {
      // On failure, also clear code to avoid reuse/guessing
      setCode(Array(6).fill(""));
      // Do NOT reveal which digit failed, just rely on parent to show generic message
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md w-full" role="group" aria-label="6-digit verification code input">
      <div className="flex justify-between mb-5 space-x-2 ">
        {code.map((digit, idx) => (
          <input
            key={idx}
            type="tel" // better on mobile for numeric input
            inputMode="numeric"
            pattern="[0-9]*" // hint for mobile browsers
            maxLength={1}
            aria-label={`Digit ${idx + 1} of 6`}
            className="border p-2 rounded w-15 h-20 text-center text-3xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
            value={digit}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            onPaste={handlePaste}
            autoComplete="one-time-code"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
        ))}
      </div>
      <button
        onClick={onVerifyClick}
        disabled={joinedCode.length < 6 || isVerifying}
        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-lg font-semibold ${
          joinedCode.length < 6 || isVerifying ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-disabled={joinedCode.length < 6 || isVerifying}
        aria-busy={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify Code"}
      </button>
    </div>
  );
}
