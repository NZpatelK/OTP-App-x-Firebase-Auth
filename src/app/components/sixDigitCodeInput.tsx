import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

interface SixDigitCodeInputProps {
    verifyCode: (code: string) => void;
}

export default function SixDigitCodeInput({ verifyCode }: SixDigitCodeInputProps) {
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
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
        const filteredData = pasteData.filter((c) => /^\d$/.test(c));
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = filteredData[i] || "";
            if (inputsRef.current[i]) inputsRef.current[i]!.value = newCode[i];
        }
        setCode(newCode);
        if (filteredData.length < 6) {
            inputsRef.current[filteredData.length]?.focus();
        } else {
            inputsRef.current[5]?.focus();
        }
    };

    const joinedCode = code.join("");

    return (
        <div className="flex flex-col max-w-md w-full">
            <div className="flex justify-between mb-5 space-x-2 ">
                {code.map((digit, idx) => (
                    <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="border p-2 rounded w-15 h-20 text-center text-3xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-800"
                        value={digit}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        ref={(el) => (inputsRef.current[idx] = el)}
                        onPaste={handlePaste}
                        autoComplete="one-time-code"
                    />
                ))}
            </div>
            <button
                onClick={() => verifyCode(joinedCode)}
                disabled={joinedCode.length < 6}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 text-lg font-semibold ${joinedCode.length < 6 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
            >
                Verify Code
            </button>
        </div>
    );
};

// export default SixDigitCodeInput;
