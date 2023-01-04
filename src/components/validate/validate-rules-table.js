import React, { Component } from "react";
import PropTypes from "prop-types";
import Panel from "../panel/panel";
import Button from "../button/button";
import Banner from "../panel/banner";
import * as Message from "../../constants/messages";
import { validateRuleset } from "../../validations/rule-validation";
import Loader from "../loader/loader";
import { ViewOutcomes } from "../attributes/view-attributes";
import DataTable from "react-data-table-component";

class ValidateRulesTable extends Component {
  constructor(props) {
    super(props);
    const conditions = props.attributes.filter(
      (attr) => attr.type !== "object" && { name: attr.name, value: "" }
    );
    this.state = {
      attributes: [],
      conditions,
      message: Message.NO_VALIDATION_MSG,
      loading: false,
      outcomes: [],
      error: false,
      facts: null,
    };
    this.handleAttribute = this.handleAttribute.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.validateRules = this.validateRules.bind(this);
  }

  handleAttribute(e, index) {
    const attribute = { ...this.state.conditions[index], name: e.target.value };
    const conditions = [
      ...this.state.conditions.slice(0, index),
      attribute,
      ...this.state.conditions.slice(index + 1),
    ];
    this.setState({ conditions });
  }

  handleValue(e, index) {
    const attribute = {
      ...this.state.conditions[index],
      value: e.target.value,
    };
    const conditions = [
      ...this.state.conditions.slice(0, index),
      attribute,
      ...this.state.conditions.slice(index + 1),
    ];
    this.setState({ conditions });
  }

  handleAdd() {
    this.setState({ conditions: this.state.conditions.concat([{ name: "" }]) });
  }

  validateRules(e) {
    e.preventDefault();
    const { decisions,ruleset, index } = this.props;
    const table = ruleset.table[index];
    const {data, generateFacts} = table;
    let facts = generateFacts(data);
    this.setState({ loading: true });
    console.log(facts, data);
    validateRuleset(facts, decisions)
      .then((outcomes) => {
        this.setState({
          loading: false,
          outcomes,
          result: true,
          error: false,
          errorMessage: "",
          facts,
        });
      })
      .catch((e) => {
        this.setState({
          loading: false,
          error: true,
          errorMessage: e.error,
          result: true,
        });
      });
  }

  attributeItems = () => {
    const {
      conditions,
      loading,
      outcomes,
      result,
      error,
      errorMessage,
      facts,
    } = this.state;
    const { attributes, index, ruleset } = this.props;
    const table = ruleset.table[index];
    const {metadata, columns, data, generateFacts} = table;
    console.log(table)

    let message;
    let aggregateMessage;
    if (result) {
      const aggText=JSON.stringify(facts, null, '\t');
      aggregateMessage = (
        <div className="flex flex-col">
          <div className="text-xl font-bold">Aggregation Result</div>
          <div>{aggText.split("\n").map((i,key) => {
            return <div key={key}>{i}</div>;
        })}</div>
        </div>
      );
      if (error) {
        message = (
          <div className="form-error">
            Problem occured when processing the rules. Reason is {errorMessage}
          </div>
        );
      } else if (outcomes && outcomes.length < 1) {
        message = (
          <div>
            No outcomes found. Validation data did not match with any payout
            event.{" "}
          </div>
        );
      } else if (outcomes && outcomes.length > 0) {
        message = (
          <div className="view-params-container my-2">
            <h4 className="text-xl font-bold">Outcomes</h4>
            <ViewOutcomes items={outcomes} />
          </div>
        );
      } else {
        message = undefined;
      }
    }
    return (
      <React.Fragment>
        <div className="font-extrabold text-2xl">Example {1 + index}</div>
        <DataTable
          columns={columns}
          data={data}
          fixedHeader
          fixedHeaderScrollHeight="300px"
        />
        <div>
          <p className="text-xl font-bold">Metadata</p>
          <p>{metadata}</p>
        </div>
        <div className="btn-group my-2">
          <Button
            label={"Validate Ruleset"}
            onConfirm={this.validateRules}
            classname="primary-btn mb-4"
            type="submit"
          />
        </div>
        <hr />
        {loading && <Loader />}
        {!loading && (
          <div className="flex flex-row justify-around">
            <div>{aggregateMessage}</div>
            <div>{message}</div>
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.decisions.length < 1 && (
          <Banner message={this.state.message} />
        )}
        {this.props.decisions.length > 0 && (
          <React.Fragment>
            <Panel>
              <form>
                <div>{this.attributeItems()}</div>
              </form>
            </Panel>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

ValidateRulesTable.defaultProps = {
  attributes: [],
  decisions: [],
  ruleset: {},
  index: 0,
};

ValidateRulesTable.propTypes = {
  attributes: PropTypes.array,
  decisions: PropTypes.array,
  ruleset: PropTypes.object,
  index: PropTypes.number,
  table: PropTypes.object,
};

export default ValidateRulesTable;
