import React, { useState } from 'react';

function App() {
  const [nfcData, setNfcData] = useState('');
  const [error, setError] = useState('');
  const [writeStatus, setWriteStatus] = useState('');
  const [inputText, setInputText] = useState('');

  const handleNFCScan = async () => {
    try {
      if (!('NDEFReader' in window)) {
        setError('NFC is not supported in this browser');
        return;
      }
      const ndef = new NDEFReader();
      // request permission
      await ndef.scan();
      ndef.onreading = (event) => {
        const decoder = new TextDecoder();
        let tagData = '';

        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            tagData += decoder.decode(record.data) + ' ';
          }
        }
        setNfcData(tagData.trim());
      };

      ndef.onreadingerror = () => {
        setError('Failed to read NFC tag');
      };
    } catch (err) {
      setError(`NFC Error: ${err.message}`);
    }
  };

  const handleWriteNFC = async () => {
    if (!inputText) {
      setError('Please enter text to write to NFC.');
      return;
    }

    try {
      if (!('NDEFReader' in window)) {
        setError('NFC is not supported in this browser');
        return;
      }

      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'text',
            data: new TextEncoder().encode(inputText)
          }
        ]
      });

      setWriteStatus('Data written successfully to the NFC tag!');
      setError('');
    } catch (err) {
      setError(`Failed to write NFC tag: ${err.message}`);
    }
  };

  return (
    <div className='flex flex-col p-4 gap-5'>
      <h1 className='text-3xl text-center'>NFC Reader and Writer</h1>
      {error && <p className="text-red-500">{error}</p>}
      {writeStatus && <p className="text-green-500">{writeStatus}</p>}
      <p>NFC Data: {nfcData || 'Scan an NFC tag...'}</p>
      <div>
        <label htmlFor="nfc-input" className="text-lg font-semibold">Enter Text to Write to NFC:</label>
        <input
          id="nfc-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="border-2 border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleNFCScan}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Start NFC Scan
      </button>
      <button
        onClick={handleWriteNFC}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Write Data to NFC
      </button>
    </div>
  );
}

export default App;
