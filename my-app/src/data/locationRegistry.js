/**
 * Ceylon Calling - Geographic & Regional Registry
 * Scoped to North Central Province (Anuradhapura & Polonnaruwa)
 * Designed for future modular expansion across Sri Lanka.
 */

export const SRI_LANKA_REGIONS = {
  north_central: {
    id: "north_central",
    provinceName: "North Central Province",
    sinhala: "උතුරු මැද පළාත",
    isActive: true, // Primary active tourism scope
    districts: {
      anuradhapura: {
        id: "anuradhapura",
        name: "Anuradhapura",
        sinhala: "අනුරාධපුරය",
        isActive: true,
        defaultCoordinates: { lat: 8.3114, lng: 80.4037 },
        cities: [
          { id: "anuradhapura_town", name: "Anuradhapura Town", sinhala: "අනුරාධපුර නගරය" },
          { id: "sacred_city", name: "Sacred City & Heritage Area", sinhala: "පූජා නගරය" },
          { id: "mihintale", name: "Mihintale", sinhala: "මිහින්තලේ" },
          { id: "nuwarawewa", name: "Nuwara Wewa Lakefront", sinhala: "නුවරවැව පරිශ්‍රය" },
          { id: "tissawewa", name: "Tissa Wewa Area", sinhala: "තිසාවැව පරිශ්‍රය" },
          { id: "new_town", name: "New Town", sinhala: "නව නගරය" },
          { id: "kekirawa", name: "Kekirawa", sinhala: "කැකිරාව" },
          { id: "habarana_border", name: "Habarana Border", sinhala: "හබරණ මායිම" },
          { id: "medawachchiya", name: "Medawachchiya", sinhala: "මැදවච්චිය" },
          { id: "tambuttegama", name: "Tambuttegama", sinhala: "තඹුත්තේගම" },
          { id: "nachchaduwa", name: "Nachchaduwa", sinhala: "නාච්චදූව" },
          { id: "galnewa", name: "Galnewa", sinhala: "ගල්නෑව" },
          { id: "eppawala", name: "Eppawala", sinhala: "එප්පාවල" }
        ]
      },
      polonnaruwa: {
        id: "polonnaruwa",
        name: "Polonnaruwa",
        sinhala: "පොළොන්නරුව",
        isActive: true,
        defaultCoordinates: { lat: 7.9403, lng: 81.0188 },
        cities: [
          { id: "polonnaruwa_town", name: "Polonnaruwa Heritage City", sinhala: "පොළොන්නරුව පෞරාණික නගරය" },
          { id: "kaduruwela", name: "Kaduruwela Commercial Area", sinhala: "කදුරුවෙල" },
          { id: "giritale", name: "Giritale Lakefront", sinhala: "ගිරිතලේ" },
          { id: "parakrama_samudra", name: "Parakrama Samudra Area", sinhala: "පරාක්‍රම සමුද්‍රය පරිශ්‍රය" },
          { id: "hingurakgoda", name: "Hingurakgoda", sinhala: "හිඟුරක්ගොඩ" },
          { id: "medirigiriya", name: "Medirigiriya", sinhala: "මැදිරිගිරිය" },
          { id: "minneriya", name: "Minneriya / Eco-Tourism Area", sinhala: "මින්නේරිය" },
          { id: "bakamuna", name: "Bakamuna", sinhala: "බකමූණ" },
          { id: "welikanda", name: "Welikanda", sinhala: "වැලික්කන්ද" }
        ]
      }
    }
  }
};

export const ALLOWED_PROVINCES = ["North Central Province"];
export const ALLOWED_DISTRICTS = ["Anuradhapura", "Polonnaruwa"];

export const getActiveDistricts = () => {
  const list = [];
  Object.values(SRI_LANKA_REGIONS).forEach(region => {
    if (region.isActive) {
      Object.values(region.districts).forEach(district => {
        if (district.isActive) list.push(district);
      });
    }
  });
  return list;
};

export const getCitiesByDistrict = (districtNameOrId) => {
  if (!districtNameOrId) return [];
  const normalized = String(districtNameOrId).toLowerCase().trim();
  for (const region of Object.values(SRI_LANKA_REGIONS)) {
    if (region.isActive) {
      for (const [dKey, district] of Object.entries(region.districts)) {
        if (dKey === normalized || district.name.toLowerCase() === normalized) {
          return district.cities;
        }
      }
    }
  }
  return [];
};

export const validateNorthCentralLocation = ({ province, district, city }) => {
  const normProvince = String(province || "North Central Province").trim();
  const normDistrict = String(district || "").trim().toLowerCase();
  
  if (normProvince !== "North Central Province") {
    return { valid: false, error: "Ceylon Calling is currently exclusively scoped to North Central Province." };
  }

  const validDistrictNames = ["anuradhapura", "polonnaruwa"];
  if (!validDistrictNames.includes(normDistrict)) {
    return { valid: false, error: "Only businesses located in Anuradhapura or Polonnaruwa can be registered." };
  }

  return { valid: true };
};
