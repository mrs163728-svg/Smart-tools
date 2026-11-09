import React from 'react';
import { ToolItem } from '../../types';
import { ToolShell } from './ToolShell';

// Calculators
import { AgeCalculator } from './calculators/AgeCalculator';
import { ScientificCalculator } from './calculators/ScientificCalculator';
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { BmiCalculator } from './calculators/BmiCalculator';
import { DateCalculator } from './calculators/DateCalculator';
import { TimeCalculator } from './calculators/TimeCalculator';

// Text Tools
import { WordCounter } from './text/WordCounter';
import { CharacterCounter } from './text/CharacterCounter';
import { CaseConverter } from './text/CaseConverter';
import { TextReverser } from './text/TextReverser';
import { RemoveExtraSpaces } from './text/RemoveExtraSpaces';
import { LoremIpsumGenerator } from './text/LoremIpsumGenerator';

// Image Tools
import { ImageCompressor } from './images/ImageCompressor';
import { ImageResizer } from './images/ImageResizer';
import { ImageConverter } from './images/ImageConverter';
import { JpgToPngConverter } from './images/JpgToPngConverter';
import { PngToJpgConverter } from './images/PngToJpgConverter';

// PDF Tools
import { MergePdf } from './pdf/MergePdf';
import { SplitPdf } from './pdf/SplitPdf';
import { CompressPdf } from './pdf/CompressPdf';
import { JpgToPdf } from './pdf/JpgToPdf';
import { PdfToJpg } from './pdf/PdfToJpg';

// Developer Tools
import { QrCodeGenerator } from './developer/QrCodeGenerator';
import { PasswordGenerator } from './developer/PasswordGenerator';
import { UrlEncoderDecoder } from './developer/UrlEncoderDecoder';
import { Base64Tool } from './developer/Base64Tool';
import { JsonFormatter } from './developer/JsonFormatter';
import { HtmlFormatter } from './developer/HtmlFormatter';

// Converter Tools
import { CurrencyConverter } from './converters/CurrencyConverter';
import { LengthConverter } from './converters/LengthConverter';
import { WeightConverter } from './converters/WeightConverter';
import { TemperatureConverter } from './converters/TemperatureConverter';
import { SpeedConverter } from './converters/SpeedConverter';
import { DataStorageConverter } from './converters/DataStorageConverter';

interface ToolDispatcherProps {
  tool: ToolItem;
  onNavigate: (view: string, toolId?: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
}

const TOOL_INSTRUCTIONS: Record<string, { step: string; detail: string }[]> = {
  'age-calculator': [
    { step: 'Select Birth Date', detail: 'Choose your date of birth using the calendar picker.' },
    { step: 'Review Age Breakdown', detail: 'See your age in exact years, months, and days lived.' },
    { step: 'Check Next Birthday', detail: 'View how many days and what weekday your next birthday will fall on.' },
  ],
  'scientific-calculator': [
    { step: 'Input Expression', detail: 'Type or click numbers, arithmetic symbols, brackets, and powers.' },
    { step: 'Use Scientific Keys', detail: 'Apply trigonometric functions (sin, cos, tan), log, ln, or square roots.' },
    { step: 'Compute and Copy', detail: 'Press = to evaluate and copy the exact result to your clipboard.' },
  ],
  'percentage-calculator': [
    { step: 'Select Calculation Mode', detail: 'Choose between "What is X% of Y", "X is what % of Y", or percentage change.' },
    { step: 'Enter Numbers', detail: 'Provide initial and target values to calculate instant ratios.' },
    { step: 'Copy Results', detail: 'Use the one-click copy button to paste the computed percentage.' },
  ],
  'bmi-calculator': [
    { step: 'Select Units', detail: 'Toggle between Metric (cm/kg) and Imperial (ft, in / lbs).' },
    { step: 'Enter Measurements', detail: 'Input your height and current weight.' },
    { step: 'Review Health Category', detail: 'Inspect your BMI index, colored range gauge, and ideal weight target.' },
  ],
  'date-calculator': [
    { step: 'Choose Mode', detail: 'Select whether to calculate days between dates or add/subtract time from a date.' },
    { step: 'Pick Dates', detail: 'Specify dates using the interactive calendar pickers.' },
    { step: 'Get Exact Duration', detail: 'Review duration in days, weeks, months, and years.' },
  ],
  'time-calculator': [
    { step: 'Enter Start & End Times', detail: 'Provide 24-hour time values in hours, minutes, and seconds.' },
    { step: 'Inspect Difference', detail: 'View the exact elapsed duration formatted clearly.' },
    { step: 'Copy Result', detail: 'Easily copy the formatted duration for timesheets and project logs.' },
  ],
  'word-counter': [
    { step: 'Input or Paste Text', detail: 'Type or paste content directly into the editor.' },
    { step: 'Review Live Stats', detail: 'Watch word, character, sentence, and paragraph counts update in real-time.' },
    { step: 'Check Reading Time', detail: 'See estimated reading and speaking times based on industry averages.' },
  ],
  'character-counter': [
    { step: 'Paste Text', detail: 'Insert your text into the analysis area.' },
    { step: 'Inspect Breakdown', detail: 'Examine characters with spaces, without spaces, symbols, and digits.' },
    { step: 'Optimize Length', detail: 'Ensure your content fits limits for social media, SEO tags, or essays.' },
  ],
  'case-converter': [
    { step: 'Enter Text', detail: 'Type or paste your content in the input field.' },
    { step: 'Pick Target Case', detail: 'Click any format button: UPPERCASE, Title Case, camelCase, snake_case, etc.' },
    { step: 'Copy Transformed Text', detail: 'Instantly copy the newly converted casing with one click.' },
  ],
  'text-reverser': [
    { step: 'Input Text', detail: 'Paste or type text to invert.' },
    { step: 'Choose Reversal Mode', detail: 'Reverse all characters, word order, or letters inside each word.' },
    { step: 'Copy Output', detail: 'Copy the flipped output for cryptography, puzzles, or design.' },
  ],
  'remove-extra-spaces': [
    { step: 'Paste Raw Text', detail: 'Insert text containing irregular spacing or messy line breaks.' },
    { step: 'Toggle Rules', detail: 'Choose to collapse multiple spaces, trim lines, or remove empty lines.' },
    { step: 'Get Clean Text', detail: 'Copy the tidied content with all unwanted whitespace eliminated.' },
  ],
  'lorem-ipsum-generator': [
    { step: 'Select Format & Quantity', detail: 'Choose paragraph, sentence, or word mode and specify quantity.' },
    { step: 'Generate Text', detail: 'Click Regenerate to create customized placeholder Latin text.' },
    { step: 'Copy to Clipboard', detail: 'Use the copy button to paste mock copy into your wireframes.' },
  ],
  'image-compressor': [
    { step: 'Upload Image', detail: 'Select or drag and drop a JPG, PNG, or WebP image.' },
    { step: 'Adjust Quality Slider', detail: 'Tweak compression percentage to find the ideal size vs fidelity balance.' },
    { step: 'Download Result', detail: 'Inspect file savings and click Download to save the compressed image.' },
  ],
  'image-resizer': [
    { step: 'Upload Image', detail: 'Drop an image from your computer or device.' },
    { step: 'Set Dimensions', detail: 'Enter target width and height or use percentage presets.' },
    { step: 'Download Resized', detail: 'Download high-quality scaled image with aspect ratio intact.' },
  ],
  'image-converter': [
    { step: 'Select Image File', detail: 'Choose an image in PNG, JPG, or WebP format.' },
    { step: 'Choose Format', detail: 'Select your target output format and optional background fill.' },
    { step: 'Download Converted', detail: 'Download the newly converted graphic instantly.' },
  ],
  'jpg-to-png-converter': [
    { step: 'Upload JPG', detail: 'Select any JPEG or JPG photo from your device.' },
    { step: 'Instant Conversion', detail: 'Your browser renders a lossless PNG version automatically.' },
    { step: 'Download PNG', detail: 'Click Download to save the PNG version without quality loss.' },
  ],
  'png-to-jpg-converter': [
    { step: 'Upload PNG', detail: 'Select a PNG graphic or logo.' },
    { step: 'Configure Fill Color', detail: 'Choose a background fill color for transparent transparent regions.' },
    { step: 'Download JPG', detail: 'Save the optimized JPEG file.' },
  ],
  'merge-pdf': [
    { step: 'Add Multiple PDFs', detail: 'Upload 2 or more PDF documents you wish to combine.' },
    { step: 'Reorder Files', detail: 'Use the up/down arrows to arrange pages in your preferred order.' },
    { step: 'Merge & Download', detail: 'Click Merge to generate and download the single unified PDF.' },
  ],
  'split-pdf': [
    { step: 'Upload PDF', detail: 'Choose the multi-page PDF you want to split.' },
    { step: 'Specify Page Range', detail: 'Enter page ranges such as "1-3" or "2, 4, 6".' },
    { step: 'Extract Pages', detail: 'Download the newly separated PDF document with only your chosen pages.' },
  ],
  'compress-pdf': [
    { step: 'Upload PDF File', detail: 'Select a PDF document to optimize.' },
    { step: 'Stream Optimization', detail: 'Browser compresses internal font and content streams automatically.' },
    { step: 'Download Compressed PDF', detail: 'Save the smaller PDF file ready for email or web upload.' },
  ],
  'jpg-to-pdf': [
    { step: 'Upload Photos', detail: 'Choose one or multiple JPG/PNG images.' },
    { step: 'Reorder Pages', detail: 'Preview images as pages in your upcoming PDF.' },
    { step: 'Generate Document', detail: 'Download your multi-page PDF ready for sharing.' },
  ],
  'pdf-to-jpg': [
    { step: 'Select PDF', detail: 'Choose a PDF document from your device.' },
    { step: 'Preview Extracted Pages', detail: 'Inspect high-resolution visual previews of every page.' },
    { step: 'Download Images', detail: 'Download individual page JPGs with one click.' },
  ],
  'qr-code-generator': [
    { step: 'Choose QR Type', detail: 'Select URL, plain text, WiFi credentials, or email.' },
    { step: 'Enter Details & Colors', detail: 'Fill in details and customize foreground and background colors.' },
    { step: 'Download High-Res QR', detail: 'Download PNG image ready for print, packaging, or digital sharing.' },
  ],
  'password-generator': [
    { step: 'Set Password Length', detail: 'Use the slider to choose password length between 6 and 64 characters.' },
    { step: 'Toggle Character Sets', detail: 'Enable uppercase, lowercase, numbers, symbols, and exclude lookalike characters.' },
    { step: 'Copy Secure Password', detail: 'Click Copy to store the cryptographically random password in your manager.' },
  ],
  'url-encoder-decoder': [
    { step: 'Paste URL or Text', detail: 'Input any URL or query parameter string.' },
    { step: 'Choose Encode or Decode', detail: 'Switch between percent encoding and human-readable decoding.' },
    { step: 'Copy Result', detail: 'Copy clean, safe URL strings for web requests and APIs.' },
  ],
  'base64-encoder-decoder': [
    { step: 'Enter Text or Upload File', detail: 'Type UTF-8 text or drop a file to convert.' },
    { step: 'Select Operation', detail: 'Toggle Encode to Base64 or Decode from Base64.' },
    { step: 'Copy or Swap', detail: 'Copy output or swap results to test reverse decoding.' },
  ],
  'json-formatter': [
    { step: 'Paste JSON Code', detail: 'Insert minified or unformatted JSON data into the input box.' },
    { step: 'Format or Minify', detail: 'Select 2-space indentation, 4-space, or compact minification.' },
    { step: 'Validate & Download', detail: 'Review syntax validation indicators and download the formatted .json file.' },
  ],
  'html-formatter': [
    { step: 'Paste HTML Markup', detail: 'Input raw or messy HTML code into the editor.' },
    { step: 'Beautify or Minify', detail: 'Format with clean indented structure or strip whitespaces to minify.' },
    { step: 'Live Preview', detail: 'Toggle to the Live Preview tab to inspect how the markup renders.' },
  ],
  'currency-converter': [
    { step: 'Enter Amount', detail: 'Provide the currency amount you want to convert.' },
    { step: 'Select Currencies', detail: 'Choose your base currency and target currency from 35+ global pairs.' },
    { step: 'View Live Rate', detail: 'Check the real-time conversion and timestamped exchange rate.' },
  ],
  'length-converter': [
    { step: 'Enter Distance', detail: 'Input numerical length or distance value.' },
    { step: 'Select Units', detail: 'Choose from meters, kilometers, feet, inches, miles, and nautical miles.' },
    { step: 'Copy Result', detail: 'Copy the exact converted measurement with high precision.' },
  ],
  'weight-converter': [
    { step: 'Input Weight Value', detail: 'Type in the weight or mass value.' },
    { step: 'Pick Units', detail: 'Convert between kilograms, grams, pounds, ounces, and tons.' },
    { step: 'Instant Result', detail: 'View and copy the converted weight value immediately.' },
  ],
  'temperature-converter': [
    { step: 'Input Degrees', detail: 'Enter the temperature number to convert.' },
    { step: 'Choose Scale', detail: 'Select between Celsius, Fahrenheit, Kelvin, and Rankine.' },
    { step: 'Review Scale Grid', detail: 'Inspect the full conversion table across all 4 temperature systems.' },
  ],
  'speed-converter': [
    { step: 'Enter Velocity', detail: 'Provide speed value in any standard unit.' },
    { step: 'Select Speed Units', detail: 'Switch between km/h, mph, meters/sec, and knots.' },
    { step: 'Copy Result', detail: 'Get instant accurate velocity calculations.' },
  ],
  'data-storage-converter': [
    { step: 'Enter Data Size', detail: 'Input digital file or memory capacity.' },
    { step: 'Choose Base Metric', detail: 'Toggle between Decimal (1,000) and Binary (1,024) calculation bases.' },
    { step: 'View All Units', detail: 'Compare sizes across Bytes, KB, MB, GB, TB, and PB in real-time.' },
  ],
};

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({
  tool,
  onNavigate,
  isFavorite,
  onToggleFavorite,
}) => {
  const instructions = TOOL_INSTRUCTIONS[tool.id] || [
    { step: 'Provide Input', detail: 'Enter or upload your data into the fields above.' },
    { step: 'Process', detail: 'Your browser computes the results instantly and privately.' },
    { step: 'Copy or Download', detail: 'Save the output with one click.' },
  ];

  const renderToolComponent = () => {
    switch (tool.id) {
      // CALCULATORS
      case 'age-calculator':
        return <AgeCalculator />;
      case 'scientific-calculator':
        return <ScientificCalculator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'date-calculator':
        return <DateCalculator />;
      case 'time-calculator':
        return <TimeCalculator />;

      // TEXT
      case 'word-counter':
        return <WordCounter />;
      case 'character-counter':
        return <CharacterCounter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'text-reverser':
        return <TextReverser />;
      case 'remove-extra-spaces':
        return <RemoveExtraSpaces />;
      case 'lorem-ipsum-generator':
        return <LoremIpsumGenerator />;

      // IMAGES
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-converter':
        return <ImageConverter />;
      case 'jpg-to-png-converter':
        return <JpgToPngConverter />;
      case 'png-to-jpg-converter':
        return <PngToJpgConverter />;

      // PDF
      case 'merge-pdf':
        return <MergePdf />;
      case 'split-pdf':
        return <SplitPdf />;
      case 'compress-pdf':
        return <CompressPdf />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'pdf-to-jpg':
        return <PdfToJpg />;

      // DEVELOPER
      case 'qr-code-generator':
        return <QrCodeGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'url-encoder-decoder':
        return <UrlEncoderDecoder />;
      case 'base64-encoder-decoder':
        return <Base64Tool />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'html-formatter':
        return <HtmlFormatter />;

      // CONVERTERS
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'length-converter':
        return <LengthConverter />;
      case 'weight-converter':
        return <WeightConverter />;
      case 'temperature-converter':
        return <TemperatureConverter />;
      case 'speed-converter':
        return <SpeedConverter />;
      case 'data-storage-converter':
        return <DataStorageConverter />;

      default:
        return <div>Tool not found</div>;
    }
  };

  return (
    <ToolShell
      tool={tool}
      onNavigate={onNavigate}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
      instructions={instructions}
    >
      {renderToolComponent()}
    </ToolShell>
  );
};
