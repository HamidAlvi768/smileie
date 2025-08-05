import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import {
    Card,
    CardBody,
    Col,
} from "reactstrap";

import { Link } from 'react-router-dom';
import { getPatients } from '../../store/patients/actions';
import { getCountryCode } from './countries';

// Function to get full country name from country code
const getCountryName = (countryCode) => {
  const countryNames = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AD": "Andorra",
    "AO": "Angola",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BR": "Brazil",
    "BN": "Brunei",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "Democratic Republic of the Congo",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GR": "Greece",
    "GD": "Grenada",
    "GT": "Guatemala",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HN": "Honduras",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "North Korea",
    "KR": "South Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Laos",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "MX": "Mexico",
    "FM": "Micronesia",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "MK": "North Macedonia",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "QA": "Qatar",
    "RO": "Romania",
    "RU": "Russia",
    "RW": "Rwanda",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syria",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
  };
  
  return countryNames[countryCode] || countryCode;
};

// Data aggregated by country using ISO 3166-1 alpha-2 codes
const RevenueByLocation = () => {
    const dispatch = useDispatch();
    const stats = useSelector((state) => state.stats.stats);
    const statsLoading = useSelector((state) => state.stats.loading);
    
    // Get all patients list from Redux
    const patients = useSelector(state => state.patients && state.patients.patients ? state.patients.patients : []);
    const patientsLoading = useSelector(state => state.patients.loading);

    // Fetch patients data on component mount
    useEffect(() => {
        dispatch(getPatients());
    }, [dispatch]);

    // Calculate new patients this month
    const getNewThisMonth = () => {
        const now = new Date();
        const thisMonth = now.getMonth(); // 0-11 (January = 0)
        const thisYear = now.getFullYear();

        console.log(`Current date: ${now}`);
        console.log(`Filtering for month: ${thisMonth} (${now.toLocaleString('default', { month: 'long' })}) and year: ${thisYear}`);
        console.log("Patients data:", patients);

        if (!Array.isArray(patients) || patients.length === 0) {
            console.log("Patients array is empty or not an array.");
            return 0;
        }

        const filteredPatients = patients.filter(patient => {
            if (!patient.created_at) {
                console.log("Patient is missing created_at property:", patient);
                return false;
            }

            const created = new Date(patient.created_at);
            
            // Check if the date is valid
            if (isNaN(created.getTime())) {
                console.log(`Invalid date format for patient: ${patient.created_at}`, patient);
                return false;
            }

            const createdMonth = created.getMonth();
            const createdYear = created.getFullYear();

            const isMatch = createdMonth === thisMonth && createdYear === thisYear;
            
            if (isMatch) {
                console.log(`✓ Patient matched - Created: ${patient.created_at}, Name: ${patient.first_name} ${patient.last_name}`);
            }

            return isMatch;
        });

        console.log(`Total patients: ${patients.length}, This month: ${filteredPatients.length}`);
        return filteredPatients.length;
    };

    const newThisMonthCount = getNewThisMonth();

    // Show loading state if patients are being fetched
    if (patientsLoading) {
        console.log("Loading patients data...");
    }

    // Use stats['global-stats'] for country data
    const countryData = React.useMemo(() => {
      const arr = stats && stats['global-stats'] ? stats['global-stats'] : [];
      console.log('Raw global-stats from API:', arr);
      console.log('Full stats object:', stats);
      
      // Map country names to patient counts using ISO codes
      const data = {};
      let totalMappedPatients = 0;
      let unmappedCountries = [];
      
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.country && item['patient-count']) {
            const countryCode = getCountryCode(item.country);
            if (countryCode) {
              data[countryCode] = parseInt(item['patient-count']) || 0;
              totalMappedPatients += parseInt(item['patient-count']) || 0;
              console.log(`✓ Mapped: ${item.country} -> ${countryCode} (${item['patient-count']} patients)`);
            } else {
              unmappedCountries.push({ country: item.country, count: item['patient-count'] });
              console.log(`✗ Unmapped: ${item.country} (${item['patient-count']} patients)`);
            }
          } else if (item.country === "" && item['patient-count']) {
            // Handle empty country name - could be "Unknown" or "Not specified"
            console.log(`⚠ Empty country name with ${item['patient-count']} patients`);
          }
        });
      } else {
        console.log('global-stats is not an array:', arr);
      }
      
      console.log('Final country data for map:', data);
      console.log('Total mapped patients:', totalMappedPatients);
      if (unmappedCountries.length > 0) {
        console.log('Unmapped countries:', unmappedCountries);
      }
      
      return data;
    }, [stats]);


    return (
        <React.Fragment>
            <Col lg={4}>
                <Card>
                    <CardBody>
                        <h5 className="card-title mb-3">Patient Distribution by Country</h5>

                        <div style={{ height: "226px", position: "relative" }}>
                            {statsLoading ? (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 text-muted">Loading map data...</p>
                                    </div>
                                </div>
                            ) : (
                                <VectorMap
                                    map={worldMill}
                                    backgroundColor="transparent"
                                    series={{
                                        regions: [
                                            {
                                                values: countryData,
                                                scale: ["#56B3B4", "#0ab39c"], // Teal gradient for countries with data
                                                min: 0,
                                                max: Math.max(...Object.values(countryData), 1),
                                            },
                                        ],
                                    }}
                                    onRegionTipShow={(event, label, code) => {
                                        // Check if the country has data
                                        if (countryData[code]) {
                                            label.html(
                                                `<strong>${label.html()}</strong><br/>${countryData[code]} Patients`
                                            );
                                        } else {
                                            label.html(
                                                `<strong>${label.html()}</strong><br/>No Data`
                                            );
                                        }
                                    }}
                                    regionStyle={{
                                        initial: {
                                            fill: "#e9ecef", // Light grey for countries with no data
                                            "fill-opacity": 0.8,
                                        },
                                        hover: {
                                            "fill-opacity": 0.9,
                                            cursor: 'pointer'
                                        },
                                        selected: {
                                            fill: "#0ab39c"
                                        },
                                        selectedHover: {
                                            fill: "#0ab39c"
                                        }
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="d-flex justify-content-between mb-3">
                                <div>
                                    <p className="text-muted mb-1">Total Patients</p>
                                    <h5 className="mb-0">{stats.patients ?? 0}</h5>
                                </div>
                                <div>
                                    <p className="text-muted mb-1">New This Month</p>
                                    <h5 className="mb-0">{newThisMonthCount}</h5>
                                </div>
                            </div>
                        </div>

                        {/* Country Distribution Summary */}
                        {Object.keys(countryData).length > 0 && (
                            <div className="mt-3">
                                <p className="text-muted mb-2 small">Top Countries:</p>
                                <div className="d-flex flex-wrap gap-2">
                                    {Object.entries(countryData)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 3)
                                        .map(([code, count]) => (
                                            <span key={code} className="badge bg-light text-dark">
                                                {getCountryName(code)}: {count}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <Link to="/patients" className="btn btn-primary btn-sm">View Patient Details</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RevenueByLocation;