import React from "react";
import "./bootstrap.min.css";

class EmotionTable extends React.Component {
  render() {
    //Returns the emotions as an HTML table
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {Object.entries(this.props.emotions).map((emotion) => {
              return (
                <tr>
                  <td>{emotion[0]}</td>
                  <td>{emotion[1]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default EmotionTable;
