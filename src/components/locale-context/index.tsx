import * as React from 'react';
import local from '../../locale/zh-CN';

export type Local = 'dialog' | 'picker' | 'datetimePicker' | 'field';

export type LocalType = Partial<Record<Local, object>>;

const localContext: LocalType = local;

const LocaleContext = React.createContext(localContext);

export default LocaleContext;
