import React from 'react';
import DiagnosticTest from '../components/diagnostic/DiagnosticTest';

export default function DiagnosticTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <DiagnosticTest
        language="fr"
        onComplete={(result) => {
          console.log('Diagnostic completed:', result);
        }}
      />
    </div>
  );
}

