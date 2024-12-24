import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./verifydoc.css";
import DropDownArrow from "../../assets/images/dropdown-arrow.png";

const App = () => {
  const [documents] = useState([
    {
      declarationNumber: "1234567890123",
      FileName: "IN-345",
      updatedDate: "2024-12-15",
      documentType: "Invoice",
      actions: "",
      downloadUrl: "/downloads/sample1.pdf",
    },
    {
      declarationNumber: "9876543210123",
      FileName: "DE-446",
      updatedDate: "2024-12-10",
      documentType: "Declaration",
      actions: "",
      downloadUrl: "/downloads/sample2.docx",
    },
    {
      declarationNumber: "1112233445566",
      FileName: "PL-12",
      updatedDate: "2024-12-08",
      documentType: "Packing List",
      actions: "",
      downloadUrl: "/downloads/sample3.xlsx",
    },
  ]);

  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [filterDocType, setFilterDocType] = useState("All");
  const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [declarationInput, setDeclarationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filterDate, setFilterDate] = useState(null);

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...documents];

    // Filter by Document Type
    if (filterDocType !== "All") {
      filtered = filtered.filter((doc) => doc.documentType === filterDocType);
    }

    // Filter by Updated Date
    if (filterDate) {
      const formattedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((doc) => doc.updatedDate === formattedDate);
    }

    // Filter by Declaration Number
    if (declarationInput) {
      filtered = filtered.filter((doc) =>
        doc.declarationNumber.includes(declarationInput)
      );
    }

    setFilteredDocuments(filtered);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDeclarationInput(inputValue);

    if (inputValue) {
      const matchingSuggestions = documents
        .filter((doc) => doc.declarationNumber.startsWith(inputValue))
        .map((doc) => doc.declarationNumber);

      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }

    applyFilters();
  };

  const selectSuggestion = (suggestion) => {
    setDeclarationInput(suggestion);
    setSuggestions([]);
    applyFilters();
  };

  const handleDocTypeChange = (type) => {
    setFilterDocType(type);
    setIsDocTypeDropdownOpen(false);
    applyFilters();
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
    setIsDocTypeDropdownOpen(false); // Close dropdown when calendar opens
  };

  const toggleDocTypeDropdown = () => {
    setIsDocTypeDropdownOpen((prev) => !prev);
    setIsCalendarOpen(false); // Close calendar when dropdown opens
  };

  const handleAction = (actionType) => {
    const updatedDocuments = filteredDocuments.map((doc, index) =>
      selectedRows.includes(index) ? { ...doc, actions: actionType } : doc
    );

    const remainingDocuments = updatedDocuments.filter(
      (doc) => doc.actions !== "Approved" && doc.actions !== "Rejected"
    );

    setFilteredDocuments(remainingDocuments);
    setSelectedRows([]);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
        setIsDocTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="verify-container">
      <h2>Verify Document</h2>

      {/* Declaration Number Search */}
      <div className="declaration-number">
        <label className="declaration_no">
          <b>Declaration Number: </b>
        </label>
        <input
          id="declarationNumber"
          type="text"
          value={declarationInput}
          onChange={handleInputChange}
          placeholder="Enter 13-digit DecNum"
        />
        <button
          className="approvebtn1"
          onClick={() => handleAction("Approved")}
          style={{ marginRight: "10px" }}
        >
          Approve
        </button>
        <button className="rejectbtn1" onClick={() => handleAction("Rejected")}>
          Reject
        </button>

        {/* Suggestion Box */}
        {suggestions.length > 0 && (
          <ul className="suggestion-box">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Document Table */}
      <div className="form-section">
        <table className="document-table">
          <thead>
            <tr>
              <th>Declaration Number</th>
              <th>File Name</th>
              <th>
                Updated Date
                <button className="calendarbtn" onClick={toggleCalendar}>
                  📅
                </button>
                {isCalendarOpen && (
                  <div ref={calendarRef} style={{ zIndex: 1000 }}>
                    <DatePicker
                      selected={filterDate}
                      onChange={(date) => {
                        setFilterDate(date);
                        setIsCalendarOpen(false);
                        applyFilters();
                      }}
                      inline
                    />
                  </div>
                )}
              </th>
              <th>
                Document Type
                <button
                  className="show-doc-type-btn"
                  onClick={toggleDocTypeDropdown}
                >
                  <img
                    src={DropDownArrow}
                    alt="dropdown-arrow"
                    className="dropdown-arrow"
                  />
                </button>
                {isDocTypeDropdownOpen && (
                  <div ref={dropdownRef} className="verifydoc-dropdown-list">
                    <ul className="doc-list">
                      <li
                        onClick={() => handleDocTypeChange("All")}
                        className="allbtn"
                      >
                        All
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Declaration")}
                        className="declaration"
                      >
                        Declaration
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Invoice")}
                        className="invoice"
                      >
                        Invoice
                      </li>
                      <li
                        onClick={() => handleDocTypeChange("Packing List")}
                        className="packing-list"
                      >
                        Packing List
                      </li>
                    </ul>
                  </div>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc, index) => (
              <tr key={index}>
                <td>{doc.declarationNumber}</td>
                <td>
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    {doc.FileName || "View Document"}
                  </a>
                </td>
                <td>{doc.updatedDate}</td>
                <td>{doc.documentType}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() =>
                      setSelectedRows((prev) =>
                        prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;