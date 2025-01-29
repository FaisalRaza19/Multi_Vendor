import React, { useState } from "react";
import styles from "../../../../Styles/style.js";
import { faqData } from "../../../../Static/static.jsx"

const FAQ = () => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tabId) => {
        setActiveTab(activeTab === tabId ? 0 : tabId);
    };

    return (
        <div className={`${styles.section} my-8 mt-36`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
            <div className="mx-auto space-y-4">
                {faqData.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-4">
                        <button
                            className="flex items-center justify-between w-full"
                            onClick={() => toggleTab(item.id)}
                        >
                            <span className="text-lg font-medium text-gray-900">{item.question}</span>
                            {activeTab === item.id ? (
                                <svg
                                    className="h-6 w-6 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </button>
                        {activeTab === item.id && (
                            <div className="mt-4">
                                <p className="text-base text-gray-500">{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;