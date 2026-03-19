import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import useStore from '../store/useStore';

const FormRendererPane = () => {
  const { schema, formData, error, setFormData } = useStore();

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border text-red-500 w-full h-2/3 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 leading-tight border-b pb-2">Error</h2>
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-7 border border-white/60 min-h-[400px] lg:h-[60%] overflow-y-auto w-full flex flex-col scrollbar-custom animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 leading-tight border-b border-gray-100 pb-3 flex-shrink-0 flex items-center gap-3">
        <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">📝</span>
        Form Preview
      </h2>
      <div className="flex-1 mt-2">
        {schema ? (
          <Form
            schema={schema}
            formData={formData}
            onChange={e => setFormData(e.formData)}
            validator={validator}
            className="custom-rjsf"
            showErrorList={false}
          >
            <div>
              {/* Hide the default submit button */}
              <button type="submit">Submit</button>
            </div>
          </Form>
        ) : (
          <div className="text-gray-500 italic mt-8 text-center flex items-center justify-center h-full">No schema generated yet. Describe a form to begin!</div>
        )}
      </div>
    </div>
  );
};

export default FormRendererPane;
