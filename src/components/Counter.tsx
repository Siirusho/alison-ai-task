"use client";

import React, { useCallback } from "react";
import { CounterWidgetProps } from "../lib/types";
import { Plus, Minus, Hash, Clock, User } from "lucide-react";
import { TimeHelpers } from "../helpers/timeHelpers";

const CollaborativeCounter = ({
  counter,
  onIncrement,
  onDecrement,
}: CounterWidgetProps) => {
  const formatTimestamp = useCallback((timestamp: number | null) => {
    if (!timestamp) return "Never";
    return TimeHelpers.formatRelativeTime(timestamp);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Hash className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold">Counter</h2>
        </div>
      </div>
      <div className="flex-grow flex flex-col items-center pt-0 p-6">
        <div className="p-8 mb-8 rounded-xl bg-[#f5deb3] text-white min-w-[120px] text-center shadow-lg">
          <div className="text-5xl font-bold">{counter.value}</div>
        </div>

        <div className="flex gap-5 mb-8">
          <button
            onClick={onDecrement}
            className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            title="Decrement counter"
          >
            <Minus size={24} />
          </button>

          <button
            onClick={onIncrement}
            className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
            title="Increment counter"
          >
            <Plus size={24} />
          </button>
        </div>

        {counter.lastUpdatedBy && (
          <>
            <div className="w-full border-t border-gray-200 mb-5" />
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3">
                <User className="text-gray-600" size={16} />
                <span className="text-sm text-gray-600">Last updated by:</span>
                <span className="px-3 py-1.5 text-xs font-medium border border-blue-600 text-blue-600 rounded">
                  {counter.lastUpdatedBy}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-gray-600" size={16} />
                <span className="text-sm text-gray-600">Updated:</span>
                <span className="text-sm font-medium">
                  {formatTimestamp(counter.lastUpdatedAt)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { CollaborativeCounter };
