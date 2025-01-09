import React from "react";

interface ContentProps {
  selectedOption: string;
}

const Content: React.FC<ContentProps> = ({ selectedOption }) => {
  const renderContent = () => {
    switch (selectedOption) {
      case "General":
        return (
          <div>
            <h2 className="content-header">General Information</h2>
            <form className="form">
              <div className="form-group">
                <label>Upload picture of yourself:</label>
                <input type="file" className="file-input" />
              </div>
              <div className="form-group">
                <input type="checkbox" id="delete-picture" />
                <label htmlFor="delete-picture">Delete Profile Picture</label>
              </div>
              <div className="form-group">
                <label>Your Name:</label>
                <input type="text" defaultValue="Nikhil Gehlot" className="text-input" />
              </div>
              <div className="form-group">
                <label>Your Date of Birth:</label>
                <input type="date" defaultValue="2005-08-15" className="text-input" />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="gender" value="Female" /> Female
                  </label>
                  <label>
                    <input type="radio" name="gender" value="Male" defaultChecked /> Male
                  </label>
                  <label>
                    <input type="radio" name="gender" value="Other" /> Other
                  </label>
                </div>
              </div>
              <button type="submit" className="save-button">Save</button>
            </form>
          </div>
        );
      default:
        return <h2 className="content-header">{selectedOption} Content</h2>;
    }
  };

  return <div className="content">{renderContent()}</div>;
};

export default Content;
