import React, { forwardRef } from 'react';
import { ConnectButton as CB } from 'thirdweb/react';


// Wrap your ConnectButton component with React.forwardRef
const ConnectButton = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { client, chain, connectModal, ...rest } = props;

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={props.style}>
      <CB client={client} chain={chain} connectModal={connectModal} {...rest} />
    </div>
  );
});

export default ConnectButton;
