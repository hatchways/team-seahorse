import React from "react";
import { FOLLOWED, PRICE } from "../utils/enums";
import FollowedNotification from "./FollowedNotification";
import PriceNotification from "./PriceNotification";

const BaseNotification = ({ type, notification, index }) => {
  return (
    <>
      {type === FOLLOWED && (
        <FollowedNotification notification={notification} index={index} />
      )}
      {type === PRICE && (
        <PriceNotification notification={notification} index={index} />
      )}
    </>
  );
};

export default BaseNotification;
