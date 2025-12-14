'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function DisclaimerModal() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = sessionStorage.getItem('disclaimer-accepted');
        if (!accepted) setShow(true);
    }, []);

    const accept = () => {
        sessionStorage.setItem('disclaimer-accepted', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 text-orange-600">
                    <AlertTriangle className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Important Notice</h2>
                </div>

                <div className="space-y-3 text-sm">
                    <p className="font-semibold text-lg">This is a PROTOTYPE for educational purposes.</p>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border border-orange-200">
                        <p className="font-semibold mb-2">KEY LIMITATIONS:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>This platform trades ENERGY CREDITS, not physical electricity</li>
                            <li>Physical energy delivery requires grid operator integration (future phase)</li>
                            <li>NOT licensed for commercial energy trading</li>
                            <li>Regulatory approval required for production use</li>
                            <li>Testnet only - for demonstration purposes</li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200">
                        <p className="font-semibold mb-2">WHAT THIS DEMONSTRATES:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Transparent marketplace for renewable energy credits</li>
                            <li>Blockchain-based trustless escrow system</li>
                            <li>Smart contract automation for settlements</li>
                            <li>Proof-of-concept for decentralized energy markets</li>
                        </ul>
                    </div>

                    <p className="text-xs text-gray-600">
                        ⚠️ Smart contracts not professionally audited. Admin roles exist for dispute resolution.
                    </p>
                </div>

                <button
                    onClick={accept}
                    className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                    I Understand - Continue to Demo
                </button>
            </div>
        </div>
    );
}
