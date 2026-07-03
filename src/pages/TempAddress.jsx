import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdContentCopy, MdRefresh, MdLocationOn, MdPhone, MdMyLocation } from 'react-icons/md';
import { useSEO } from '../utils/useSEO';
import './TempAddress.css';

// City-specific data: areas, streets, mandals, taluks, pin prefixes
const CITY_DETAILS = {
  // India
  'Hyderabad': {
    state: 'Telangana', country: 'India', countryCode: 'IN', pinPrefix: '500',
    areas: ['Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Ameerpet', 'Secunderabad', 'Begumpet', 'Kondapur', 'Hitech City', 'Miyapur', 'Manikonda', 'Tolichowki', 'Mehdipatnam', 'Dilsukhnagar'],
    streets: ['Road No 1', 'Road No 10', 'Road No 36', 'MG Road', 'SP Road', 'Tank Bund Road', 'Panjagutta Road', 'Raj Bhavan Road', 'Necklace Road', 'Sardar Patel Road', 'Old Mumbai Highway', 'Outer Ring Road', 'NH-65'],
    mandals: ['Hyderabad', 'Secunderabad', 'Golconda', 'Ameerpet', 'Khairatabad', 'Musheerabad', 'Nampally', 'Charminar', 'Bahadurpura'],
    taluks: ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri'],
  },
  'Bangalore': {
    state: 'Karnataka', country: 'India', countryCode: 'IN', pinPrefix: '560',
    areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'JP Nagar', 'Banashankari', 'Electronic City', 'Marathahalli', 'Bellandur', 'Sarjapur Road', 'Hebbal', 'Yelahanka', 'Rajajinagar'],
    streets: ['100 Feet Road', '80 Feet Road', 'MG Road', 'Brigade Road', 'Hosur Road', 'Bannerghatta Road', 'Outer Ring Road', 'Old Airport Road', 'Bellary Road', 'Mysore Road', 'Tumkur Road', 'Kanakapura Road'],
    mandals: ['Bangalore North', 'Bangalore South', 'Bangalore East', 'Anekal', 'Yelahanka'],
    taluks: ['Bangalore Urban', 'Bangalore Rural'],
  },
  'Chennai': {
    state: 'Tamil Nadu', country: 'India', countryCode: 'IN', pinPrefix: '600',
    areas: ['Adyar', 'T Nagar', 'Anna Nagar', 'Velachery', 'Mylapore', 'Nungambakkam', 'Porur', 'Tambaram', 'Sholinganallur', 'OMR', 'Guindy', 'Egmore', 'Kodambakkam', 'Thiruvanmiyur'],
    streets: ['Anna Salai', 'Mount Road', 'Poonamallee High Road', 'GST Road', 'ECR', 'OMR', 'Cathedral Road', 'TTK Road', 'Rajaji Salai', 'Kamarajar Salai'],
    mandals: ['Mylapore', 'Velachery', 'Alandur', 'Ambattur', 'Madhavaram', 'Tondiarpet'],
    taluks: ['Chennai', 'Sriperumbudur', 'Tambaram'],
  },
  'Mumbai': {
    state: 'Maharashtra', country: 'India', countryCode: 'IN', pinPrefix: '400',
    areas: ['Andheri', 'Bandra', 'Juhu', 'Powai', 'Malad', 'Goregaon', 'Borivali', 'Dadar', 'Lower Parel', 'Worli', 'Colaba', 'Fort', 'Vikhroli', 'Thane', 'Navi Mumbai'],
    streets: ['SV Road', 'Western Express Highway', 'Eastern Express Highway', 'Link Road', 'LBS Marg', 'Senapati Bapat Marg', 'Carter Road', 'Hill Road', 'Turner Road', 'Linking Road'],
    mandals: ['Andheri', 'Borivali', 'Kurla', 'Mumbai City', 'Mumbai Suburban'],
    taluks: ['Mumbai City', 'Mumbai Suburban', 'Thane'],
  },
  'Delhi': {
    state: 'Delhi', country: 'India', countryCode: 'IN', pinPrefix: '110',
    areas: ['Connaught Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Hauz Khas', 'Greater Kailash', 'Vasant Kunj', 'Janakpuri', 'Pitampura', 'Mayur Vihar', 'Nehru Place'],
    streets: ['Ring Road', 'Outer Ring Road', 'Mathura Road', 'GT Road', 'Aurobindo Marg', 'Barakhamba Road', 'Rajpath', 'Lodhi Road', 'Mehrauli-Badarpur Road'],
    mandals: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
    taluks: ['New Delhi', 'Delhi'],
  },
  'Pune': {
    state: 'Maharashtra', country: 'India', countryCode: 'IN', pinPrefix: '411',
    areas: ['Koregaon Park', 'Viman Nagar', 'Kothrud', 'Hinjewadi', 'Baner', 'Aundh', 'Hadapsar', 'Wakad', 'Kharadi', 'Magarpatta', 'Shivajinagar', 'Deccan', 'Camp', 'Swargate'],
    streets: ['FC Road', 'JM Road', 'MG Road', 'Karve Road', 'Senapati Bapat Road', 'University Road', 'Bund Garden Road', 'Nagar Road', 'Sinhagad Road'],
    mandals: ['Pune City', 'Haveli', 'Mulshi', 'Bhor'],
    taluks: ['Pune City', 'Haveli', 'Mulshi'],
  },
  'Kolkata': {
    state: 'West Bengal', country: 'India', countryCode: 'IN', pinPrefix: '700',
    areas: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Alipore', 'Howrah', 'Dum Dum', 'Jadavpur', 'Behala', 'Tollygunge', 'Gariahat', 'Esplanade', 'Rajarhat'],
    streets: ['AJC Bose Road', 'Park Street', 'EM Bypass', 'VIP Road', 'Chowringhee Road', 'Rashbehari Avenue', 'SP Mukherjee Road', 'Diamond Harbour Road'],
    mandals: ['Kolkata', 'South 24 Parganas', 'North 24 Parganas', 'Howrah'],
    taluks: ['Kolkata', 'Alipore', 'Sealdah'],
  },
  // US
  'New York': {
    state: 'New York', country: 'United States', countryCode: 'US', pinPrefix: '100',
    areas: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Midtown', 'Downtown', 'Upper East Side', 'Upper West Side', 'SoHo', 'Chelsea', 'Harlem'],
    streets: ['Broadway', '5th Avenue', 'Park Avenue', 'Madison Avenue', 'Wall Street', 'Lexington Avenue', '7th Avenue', 'Amsterdam Avenue', 'Columbus Avenue'],
    mandals: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
    taluks: ['New York County', 'Kings County', 'Queens County'],
  },
  'Los Angeles': {
    state: 'California', country: 'United States', countryCode: 'US', pinPrefix: '900',
    areas: ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Venice', 'Downtown LA', 'Westwood', 'Brentwood', 'Malibu', 'Pasadena', 'Burbank', 'Glendale'],
    streets: ['Sunset Boulevard', 'Hollywood Boulevard', 'Wilshire Boulevard', 'Santa Monica Boulevard', 'Melrose Avenue', 'Rodeo Drive', 'Vine Street', 'La Brea Avenue'],
    mandals: ['Central LA', 'Westside', 'South LA', 'East LA', 'San Fernando Valley'],
    taluks: ['Los Angeles County'],
  },
  // UK
  'London': {
    state: 'England', country: 'United Kingdom', countryCode: 'UK', pinPrefix: 'SW1',
    areas: ['Westminster', 'Camden', 'Kensington', 'Chelsea', 'Shoreditch', 'Islington', 'Hackney', 'Southwark', 'Greenwich', 'Brixton', 'Soho', 'Mayfair'],
    streets: ['Oxford Street', 'Regent Street', 'Baker Street', 'Fleet Street', 'Strand', 'Piccadilly', 'Kings Road', 'Bond Street', 'Carnaby Street', 'Abbey Road'],
    mandals: ['City of London', 'City of Westminster', 'Camden', 'Islington', 'Hackney'],
    taluks: ['Greater London'],
  },
};

// Fallback cities per country for when city isn't in our database
const FALLBACK_CITIES = {
  IN: 'Hyderabad',
  US: 'New York',
  UK: 'London',
  DEFAULT: 'New York',
};

const PHONE_FORMATS = {
  IN: { code: '+91', format: () => `${rand(7, 9)}${randDigits(9)}` },
  US: { code: '+1', format: () => `${randDigits(3)}-${randDigits(3)}-${randDigits(4)}` },
  UK: { code: '+44', format: () => `7${randDigits(3)} ${randDigits(6)}` },
  DEFAULT: { code: '+1', format: () => `${randDigits(3)}-${randDigits(3)}-${randDigits(4)}` },
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDigits(n) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAddress(cityName) {
  const cityData = CITY_DETAILS[cityName];
  if (!cityData) return null;

  const houseNo = `${rand(1, 999)}/${rand(1, 50)}`;
  const street = pickRandom(cityData.streets);
  const area = pickRandom(cityData.areas);
  const mandal = pickRandom(cityData.mandals);
  const taluk = pickRandom(cityData.taluks);

  let zipCode;
  if (cityData.countryCode === 'UK') {
    zipCode = `${cityData.pinPrefix} ${rand(1, 9)}${String.fromCharCode(65 + rand(0, 25))}${String.fromCharCode(65 + rand(0, 25))}`;
  } else {
    zipCode = `${cityData.pinPrefix}${randDigits(3)}`;
  }

  return {
    houseNo,
    street,
    area,
    mandal,
    taluk,
    city: cityName,
    state: cityData.state,
    country: cityData.country,
    zipCode,
  };
}

function generatePhone(countryCode) {
  const code = countryCode || 'DEFAULT';
  const phoneData = PHONE_FORMATS[code] || PHONE_FORMATS.DEFAULT;
  return `${phoneData.code} ${phoneData.format()}`;
}

async function detectLocation() {
  try {
    // Use free IP geolocation API
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        city: data.city || '',
        state: data.region || '',
        country: data.country_code || 'DEFAULT',
      };
    }
  } catch (err) {
    console.warn('IP geolocation failed, trying fallback...');
  }

  try {
    // Fallback API
    const response = await fetch('https://ip-api.com/json/?fields=city,regionName,countryCode');
    if (response.ok) {
      const data = await response.json();
      return {
        city: data.city || '',
        state: data.regionName || '',
        country: data.countryCode || 'DEFAULT',
      };
    }
  } catch (err) {
    console.warn('Fallback geolocation also failed');
  }

  // Last fallback: timezone detection
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (tz.includes('Kolkata') || tz.includes('Calcutta')) return { city: 'Hyderabad', state: 'Telangana', country: 'IN' };
  if (tz.includes('America/')) return { city: 'New York', state: 'New York', country: 'US' };
  if (tz.includes('Europe/London')) return { city: 'London', state: 'England', country: 'UK' };
  return { city: 'New York', state: 'New York', country: 'US' };
}

function findClosestCity(detectedCity, countryCode) {
  // Try exact match first
  if (CITY_DETAILS[detectedCity]) {
    return detectedCity;
  }

  // Try partial match (e.g. "Bengaluru" -> "Bangalore")
  const cityNames = Object.keys(CITY_DETAILS);
  const lowerDetected = detectedCity.toLowerCase();

  for (const city of cityNames) {
    if (city.toLowerCase().includes(lowerDetected) || lowerDetected.includes(city.toLowerCase())) {
      return city;
    }
  }

  // Match by country
  const countryMap = { IN: 'India', US: 'United States', UK: 'United Kingdom' };
  const countryName = countryMap[countryCode] || '';
  const citiesInCountry = cityNames.filter(c => CITY_DETAILS[c].country === countryName);

  if (citiesInCountry.length > 0) {
    return citiesInCountry[0];
  }

  // Ultimate fallback
  return FALLBACK_CITIES[countryCode] || FALLBACK_CITIES.DEFAULT;
}

function TempAddress() {
  useSEO({
    title: 'Free Temporary Address & Phone Number Generator',
    description: 'Generate fake temporary addresses and phone numbers based on your location. Supports India, US, UK cities. Perfect for form testing and development.',
  });
  const [addresses, setAddresses] = useState([]);
  const [phones, setPhones] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    setLoading(true);
    const location = await detectLocation();
    const city = findClosestCity(location.city, location.country);
    setSelectedCity(city);
    setDetectedLocation(`${location.city}, ${location.state}`);
    generateAll(city);
    setLoading(false);
  };

  const generateAll = (cityName) => {
    const city = cityName || selectedCity;
    const cityData = CITY_DETAILS[city];
    if (!cityData) return;

    const newAddresses = [];
    for (let i = 0; i < 3; i++) {
      newAddresses.push(generateAddress(city));
    }

    const newPhones = [];
    for (let i = 0; i < 3; i++) {
      newPhones.push(generatePhone(cityData.countryCode));
    }

    setAddresses(newAddresses);
    setPhones(newPhones);
  };

  const handleRegenerate = () => {
    generateAll(selectedCity);
    toast.success('New addresses generated!');
  };

  const copyField = (value, label) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  const copyFullAddress = (addr) => {
    const full = `${addr.houseNo}, ${addr.street}, ${addr.area}, ${addr.mandal}, ${addr.taluk}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.zipCode}`;
    navigator.clipboard.writeText(full);
    toast.success('Full address copied!');
  };

  const cityData = CITY_DETAILS[selectedCity] || {};

  return (
    <main className="temp-address-page">
      <div className="page-header">
        <h1 className="page-title">
          <MdLocationOn className="title-icon" />
          Temp Address & Phone
        </h1>
        <p className="page-subtitle">
          Generate temporary addresses and phone numbers based on your location. Click any field to copy.
        </p>
      </div>

      <div className="controls-bar">
        <div className="location-display">
          <MdMyLocation />
          <span>{cityData.country} — {selectedCity}</span>
        </div>
        <button className="regenerate-btn" onClick={handleRegenerate}>
          <MdRefresh />
          <span>Regenerate All</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Detecting your location...</div>
      ) : (
        <>
          <section className="section">
            <h2 className="section-title">
              <MdLocationOn /> Temporary Addresses — {selectedCity}
            </h2>
            <div className="address-grid">
              {addresses.map((addr, index) => (
                <div key={index} className="address-card">
                  <div className="card-header">
                    <span className="card-number">Address {index + 1}</span>
                    <button className="copy-all-btn" onClick={() => copyFullAddress(addr)}>
                      <MdContentCopy /> Copy All
                    </button>
                  </div>
                  <div className="fields">
                    <FieldRow label="House/Plot" value={addr.houseNo} onCopy={copyField} />
                    <FieldRow label="Street" value={addr.street} onCopy={copyField} />
                    <FieldRow label="Area" value={addr.area} onCopy={copyField} />
                    <FieldRow label="Mandal" value={addr.mandal} onCopy={copyField} />
                    <FieldRow label="Taluk" value={addr.taluk} onCopy={copyField} />
                    <FieldRow label="City" value={addr.city} onCopy={copyField} />
                    <FieldRow label="State" value={addr.state} onCopy={copyField} />
                    <FieldRow label="Country" value={addr.country} onCopy={copyField} />
                    <FieldRow label="ZIP/PIN" value={addr.zipCode} onCopy={copyField} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">
              <MdPhone /> Temporary Phone Numbers
            </h2>
            <div className="phone-grid">
              {phones.map((phone, index) => (
                <div key={index} className="phone-card" onClick={() => copyField(phone, 'Phone number')}>
                  <div className="phone-number">{phone}</div>
                  <MdContentCopy className="phone-copy-icon" />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function FieldRow({ label, value, onCopy }) {
  return (
    <div className="field-row" onClick={() => onCopy(value, label)}>
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
      <MdContentCopy className="field-copy" />
    </div>
  );
}

export default TempAddress;
