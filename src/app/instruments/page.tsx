import { createClient } from '@/utils/supabase/server';

interface Instrument {
  id: number;
  name: string;
}

// Type guard with comprehensive checks
function isInstrument(data: unknown): data is Instrument {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' 
  );
}

// Safe parsing with type guards
function safeParseInstrument(jsonString: string): Instrument | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (isInstrument(parsed)) {
      return parsed;
    }
    console.error('Data does not match User interface');
    return null;
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
}

// Parsing JSON arrays with validation
function parseInstrumentArray(jsonString: string): Instrument[] | null {
  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      return null;
    }

    // Validate each element
    if (parsed.every(isInstrument)) {
      return parsed as Instrument[];
    }

    return null;
  } catch {
    return null;
  }
}

export default async function Instruments() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();
  
  console.debug(parseInstrumentArray(JSON.stringify(instruments,null, 2))?.at(0)?.name);
  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}