import React, { useMemo } from 'react';
import diff from 'deep-diff';
import useStore from '../store/useStore';

export default function SchemaDiffPanel() {
    const { schema: currentSchema, previousSchema } = useStore();
    
    const differences = useMemo(() => {
        if (!currentSchema || !previousSchema) return null;
        return diff(previousSchema, currentSchema);
    }, [currentSchema, previousSchema]);

    if (!currentSchema || !previousSchema) {
        return null;
    }

    return (
        <div className="bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-800 p-6 flex-1 min-h-[300px] overflow-y-auto scrollbar-custom animate-fade-in-up flex flex-col" data-testid="schema-diff-panel" style={{animationDelay: '200ms'}}>
            <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center justify-between pb-3 border-b border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <span className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">⚡</span> 
                    Schema Diff
                </div>
                <span className="text-xs px-2.5 py-1 font-mono bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">v{differences ? 'N' : 'N-1'}</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto scrollbar-custom">
                {!differences ? (
                    <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">No structural changes detected.</div>
                ) : (
                    <div className="space-y-2.5 text-sm font-mono text-gray-300">
                        {differences.map((d, idx) => {
                            const pathMatch = d.path ? d.path.join('.') : 'root';
                            if (d.kind === 'N') {
                                return (
                                    <div key={idx} className="flex gap-3 bg-green-950/30 p-2.5 rounded-lg border border-green-900/50 hover:bg-green-950/50 transition-colors">
                                        <span className="font-bold text-green-400 select-none">+</span>
                                        <div>
                                            <span className="text-green-300">Added</span> <span className="font-bold text-gray-200">{pathMatch}</span> = <span className="text-emerald-200 break-all">{JSON.stringify(d.rhs)}</span>
                                        </div>
                                    </div>
                                );
                            }
                            if (d.kind === 'D') {
                                return (
                                    <div key={idx} className="flex gap-3 bg-red-950/30 p-2.5 rounded-lg border border-red-900/50 hover:bg-red-950/50 transition-colors">
                                        <span className="font-bold text-red-500 select-none">-</span>
                                        <div>
                                            <span className="text-red-400">Removed</span> <span className="font-bold text-gray-200">{pathMatch}</span>
                                        </div>
                                    </div>
                                );
                            }
                            if (d.kind === 'E') {
                                return (
                                    <div key={idx} className="flex gap-3 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/50 hover:bg-blue-950/50 transition-colors">
                                        <span className="font-bold text-blue-400 select-none">~</span>
                                        <div>
                                            <span className="text-blue-300">Modified</span> <span className="font-bold text-gray-200">{pathMatch}</span> from <span className="text-gray-400 line-through">{JSON.stringify(d.lhs)}</span> to <span className="text-blue-200">{JSON.stringify(d.rhs)}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
