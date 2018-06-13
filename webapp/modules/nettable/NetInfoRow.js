import React from "react";

import Strings from "amdi18n-loader!../nls/requestBody";

import TabView from "../tabview/TabView";
import Headers from "../requestbodies/Headers";
import PlainResponse from "../requestbodies/PlainResponse";
import Highlighted from "../requestbodies/Highlighted";
import URLParameters from "../requestbodies/URLParameters";
import SendData from "../requestbodies/SendData";

const responseBodyComponents = {
  Headers: {
    Component: Headers,
    id: "Headers",
    label: Strings.Headers,
  },
  PlainResponse: {
    Component: PlainResponse,
    id: "Response",
    label: Strings.Response,
  },
  Highlighted: {
    Component: Highlighted,
    id: "Highlighted",
    label: Strings.Highlighted,
  },
  URLParameters: {
    Component: URLParameters,
    id: "Params",
    label: Strings.URLParameters,
  },
  SendData: {
    Component: SendData,
    id: "Post",
    // TODO, this has to be determined on-the-fly by entry.request.method
    label: "Post",
  },
};

function createTabs(props) {
  const { entry } = props;
  const tabs = [];
  Object.keys(responseBodyComponents).forEach((name) => {
    const Component = responseBodyComponents[name].Component;
    if (!Component.canShowEntry || Component.canShowEntry(entry)) {
      const info = responseBodyComponents[name];
      tabs.push(Object.assign({}, info, {
        body: <Component entry={entry} />,
      }));
    }
  });
  return tabs;
}

function NetInfoRow(props) {
  const tabs = createTabs(props);
  return (
    <tr className="netInfoRow">
      <td colSpan="9" className="netInfoCol">
        <TabView id="requestBody" tabs={tabs} />
      </td>
    </tr>
  );
};

export default NetInfoRow;
