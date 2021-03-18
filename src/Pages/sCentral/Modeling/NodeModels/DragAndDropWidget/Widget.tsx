import * as React from 'react';
import styled from '@emotion/styled';

namespace S {
	export const Tray = styled.div`
		min-width: 150px;
		background: rgb(20, 20, 20);
		flex-grow: 0;
		flex-shrink: 0;
	`;
}

export class Widget extends React.Component {
	render() {
		return <S.Tray>{this.props.children}</S.Tray>;
	}
}
