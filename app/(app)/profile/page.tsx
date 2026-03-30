"use client";

import { useState } from "react";

const arizonaCities = [
  "Phoenix", "Scottsdale", "Mesa", "Tempe", "Chandler", "Gilbert",
  "Peoria", "Glendale", "Sun City", "Sun City West", "Surprise",
  "Ahwatukee", "Fountain Hills", "Cave Creek", "Carefree",
  "Sedona", "Flagstaff", "Tucson", "Green Valley", "Sierra Vista",
];

const allInterests = [
  // Fitness
  "Chair Yoga", "Walking", "Stretching", "Light Resistance", "Dancing", "Swimming", "Cycling",
  // Creative
  "Gardening", "Cooking", "Painting", "Photography", "Music",
  // Social & Games
  "Card Games", "Board Games", "Chess",
  // Intellectual
  "Reading", "History", "Movies",
  // Life & Community
  "Birdwatching", "Volunteering", "Travel", "Grandchildren", "Pets",
];

const fitnessLevels = ["Beginner", "Moderate", "Active"];
const connectionPrefs = [
  { value: "same_age", label: "Same Age" },
  { value: "younger", label: "Younger People" },
  { value: "both", label: "Both" },
];

const lifeStages = [
  { value: "recently_retired", label: "Recently retired" },
  { value: "widowed", label: "Widowed" },
  { value: "recently_relocated", label: "Recently relocated" },
  { value: "empty_nester", label: "Empty nester" },
  { value: "long_time_resident", label: "Long-time resident" },
  { value: "other", label: "Other" },
];

const socialComfortOptions = [
  { value: "one_on_one", label: "I prefer 1-on-1 time" },
  { value: "small_group", label: "I enjoy small groups (2–4)" },
  { value: "large_group", label: "I'm comfortable in larger groups" },
];

const lookingForOptions = [
  "An activity buddy",
  "Someone to talk to",
  "Group events and outings",
  "Volunteer opportunities",
];

const availabilityOptions = ["Mornings", "Afternoons", "Evenings", "Weekends"];

export default function ProfilePage() {
  const [name, setName] = useState("Margaret Wilson");
  const [age, setAge] = useState("71");
  const [city, setCity] = useState("Phoenix");
  const [bio, setBio] = useState("Retired schoolteacher who loves outdoor activities and staying active.");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Chair Yoga", "Gardening", "Reading"]);
  const [connectionPref, setConnectionPref] = useState("same_age");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [healthGoals, setHealthGoals] = useState("Improve flexibility and balance. Stay social and motivated.");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [lifeStage, setLifeStage] = useState("");
  const [socialComfort, setSocialComfort] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);

  function toggleLookingFor(opt: string) {
    setLookingFor((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  }

  function toggleAvailability(opt: string) {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        fontFamily: "'Lexend', sans-serif",
        color: "#173124",
        padding: "2.5rem",
        maxWidth: "760px",
      }}
    >
      <h1
        style={{
          fontFamily: "'Epilogue', serif",
          fontWeight: 800,
          fontSize: "2.25rem",
          color: "#173124",
          letterSpacing: "-0.02em",
          marginBottom: "2.5rem",
        }}
      >
        Your Profile
      </h1>

      <form onSubmit={handleSave}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile photo preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "3px solid #C2C8C2",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#173124",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Epilogue', serif",
                fontWeight: 800,
                fontSize: "1.75rem",
                flexShrink: 0,
              }}
            >
              {initials || "?"}
            </div>
          )}
          <div>
            <p style={{ fontWeight: 600, fontSize: "1rem", color: "#173124", marginBottom: "0.5rem" }}>
              Profile Photo
            </p>
            <label
              htmlFor="photo-upload"
              style={{
                display: "inline-block",
                backgroundColor: "#E7E2D7",
                border: "2px solid #C2C8C2",
                borderRadius: "3rem",
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#173124",
                cursor: "pointer",
              }}
            >
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setPhotoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
        </div>

        {/* Basic info */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "1.5rem",
            }}
          >
            Basic Information
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
                Full Name
              </label>
              <input
                type="text"
                className="input-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
                Age
              </label>
              <input
                type="number"
                className="input-base"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
                min="50"
                max="110"
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
              City (Arizona)
            </label>
            <select
              className="input-base"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              {arizonaCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
              About You
            </label>
            <textarea
              className="input-base"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell potential workout partners a little about yourself..."
              rows={4}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Interests */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "0.5rem",
            }}
          >
            Interests
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            Tap to select the activities you enjoy
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {allInterests.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: "0.5rem 1.125rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    border: "2px solid",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    minHeight: "44px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Life stage */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#735C00", marginBottom: "0.5rem" }}>
            Life Stage
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            Which best describes where you are in life right now?
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {lifeStages.map((stage) => {
              const isSelected = lifeStage === stage.value;
              return (
                <button
                  key={stage.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setLifeStage(isSelected ? "" : stage.value)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    border: "2px solid",
                    cursor: "pointer",
                    minHeight: "44px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Social comfort */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#735C00", marginBottom: "0.5rem" }}>
            Social Comfort Level
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            What kind of social setting feels most comfortable to you?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {socialComfortOptions.map((opt) => {
              const isSelected = socialComfort === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSocialComfort(isSelected ? "" : opt.value)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    border: "2px solid",
                    cursor: "pointer",
                    minHeight: "48px",
                    textAlign: "left",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* What I'm looking for */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#735C00", marginBottom: "0.5rem" }}>
            What I&apos;m Looking For
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            Select all that apply
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            {lookingForOptions.map((opt) => {
              const isSelected = lookingFor.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleLookingFor(opt)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    border: "2px solid",
                    cursor: "pointer",
                    minHeight: "44px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#735C00", marginBottom: "0.5rem" }}>
            Availability
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            When are you generally free to connect?
          </p>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            {availabilityOptions.map((opt) => {
              const isSelected = availability.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleAvailability(opt)}
                  style={{
                    padding: "0.625rem 1.25rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    border: "2px solid",
                    cursor: "pointer",
                    minHeight: "44px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Connection preference */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "0.5rem",
            }}
          >
            I want to connect with
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            Choose who you&apos;d like to be matched with
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
            {connectionPrefs.map((pref) => {
              const isSelected = connectionPref === pref.value;
              return (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => setConnectionPref(pref.value)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "2px solid",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    minHeight: "48px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {pref.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fitness level */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "0.5rem",
            }}
          >
            Fitness Level
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            How would you describe your current activity level?
          </p>
          <div style={{ display: "flex", gap: "0.875rem" }}>
            {fitnessLevels.map((level) => {
              const isSelected = fitnessLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFitnessLevel(level)}
                  style={{
                    flex: 1,
                    padding: "0.875rem 1rem",
                    borderRadius: "3rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: "2px solid",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    minHeight: "52px",
                    borderColor: isSelected ? "#173124" : "#C2C8C2",
                    backgroundColor: isSelected ? "#173124" : "transparent",
                    color: isSelected ? "#FFFFFF" : "#173124",
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Health goals */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "1.25rem",
            }}
          >
            Health Goals
          </p>
          <textarea
            className="input-base"
            value={healthGoals}
            onChange={(e) => setHealthGoals(e.target.value)}
            placeholder="What health goals are you working toward? e.g., improve balance, reduce stress, stay social..."
            rows={3}
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Emergency contact */}
        <div
          style={{
            backgroundColor: "#E7E2D7",
            border: "2px solid #C2C8C2",
            borderRadius: "2.5rem",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#735C00",
              marginBottom: "0.5rem",
            }}
          >
            Emergency Contact
          </p>
          <p style={{ fontSize: "0.9rem", color: "#727973", marginBottom: "1.25rem" }}>
            Optional but recommended for your safety
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
                Contact Name
              </label>
              <input
                type="text"
                className="input-base"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
                Phone Number
              </label>
              <input
                type="tel"
                className="input-base"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="(602) 555-0100"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          style={{
            backgroundColor: saved ? "#735C00" : "#173124",
            color: "#FFFFFF",
            fontWeight: 600,
            padding: "1rem 2rem",
            borderRadius: "3rem",
            fontSize: "1.125rem",
            border: "none",
            cursor: "pointer",
            width: "100%",
            minHeight: "56px",
            transition: "background-color 0.3s",
          }}
        >
          {saved ? "✓ Profile Saved!" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
