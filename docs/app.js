(function($fsx){
// default/docSrc/src/index.js
$fsx.f[0] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const cycle_onionify_1 = $fsx.r(107);
const run_1 = $fsx.r(96);
const app_1 = $fsx.r(1);
const main = cycle_onionify_1.default(app_1.App);
run_1.run(main, { DOM: dom_1.makeDOMDriver('#app') });
}
// default/docSrc/src/components/app.js
$fsx.f[1] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const dom_1 = $fsx.r(74);
const isolate_1 = $fsx.r(94);
const rambda_1 = $fsx.r(117);
const typestyle_1 = $fsx.r(143);
const csstips = $fsx.r(98);
const csstips_1 = $fsx.r(98);
const api_1 = $fsx.r(2);
const arg_1 = $fsx.r(9);
const method_1 = $fsx.r(51);
const config_out_1 = $fsx.r(56);
exports.defaultState = {
    _methods: {},
    methods: {}
};
csstips_1.normalize();
csstips_1.setupPage('#app');
const {raw, setupInterface, setupArgComponent} = api_1.api;
const lY = value => {
    console.log(value);
    return value;
};
const methodLens = methodName => ({
    get: parentState => ({
        ...parentState._methods[methodName],
        name: methodName
    }),
    set: (parentState, childState) => ({
        ...parentState,
        _methods: {
            ...parentState._methods,
            [methodName]: childState
        },
        methods: {
            ...parentState.methods,
            [methodName]: childState.value
        }
    })
});
const isolatedMethod = (args, methodName) => isolate_1.default(method_1.method(args), {
    onion: methodLens(methodName),
    '*': methodName
});
const compList = childComponents => ({DOM, onion}) => {
    const childComponentsSinks = rambda_1.compose(rambda_1.map(component => component({
        DOM,
        onion
    })), rambda_1.values)(childComponents);
    const childComponentsDOM = rambda_1.map(rambda_1.path('DOM'), childComponentsSinks);
    const childComponentsOnion = rambda_1.map(rambda_1.path('onion'), childComponentsSinks);
    return {
        DOM: childComponentsDOM,
        onion: childComponentsOnion
    };
};
const toArray = arr => [...arr];
const filterIncludedMethods = (methods, _methods) => {
    const includedMethodNames = rambda_1.compose(rambda_1.join(','), rambda_1.values, rambda_1.map((_, methodName) => methodName), rambda_1.filter(({isIncluded}) => isIncluded))(_methods);
    const includedMethods = rambda_1.pick(includedMethodNames, methods);
    return includedMethods;
};
const configLens = key => ({
    get: parentState => ({
        ...parentState[key],
        methods: filterIncludedMethods(parentState.methods, parentState._methods)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [key]: childState
    })
});
exports.App = ({DOM, onion}) => {
    const interfaceApi = setupInterface(raw, isolatedMethod, arg_1.Arg({}));
    const methods = compList(interfaceApi)({
        DOM,
        onion
    });
    const config = isolate_1.default(config_out_1.configOut, {
        onion: configLens('config'),
        '*': 'config'
    })({
        DOM,
        onion
    });
    return {
        DOM: view(onion.state$, config.DOM, methods.DOM),
        onion: actions(DOM, methods.onion, config.onion)
    };
};
const actions = (DOM, methods, config) => {
    const init$ = xstream_1.default.of(prev => prev ? prev : exports.defaultState);
    return xstream_1.default.merge(init$, ...methods, config);
};
const wrapperStyle = typestyle_1.style({
    fontSize: '1em',
    padding: '2em',
    borderRadius: '.4em'
}, csstips.vertical);
const titleStyle = typestyle_1.style({ fontSize: '3em' });
const componentsStyle = typestyle_1.style(typestyle_1.media({ maxWidth: 900 }, csstips.vertical), typestyle_1.media({ minWidth: 901 }, csstips.horizontal));
const styles = {
    wrapper: wrapperStyle,
    title: titleStyle,
    body: componentsStyle,
    methodsWrapper: typestyle_1.style({
        flex: 2,
        height: '90vh',
        overflowY: 'scroll'
    }),
    configWrapper: typestyle_1.style({
        flex: 3,
        height: '90vh',
        overflowY: 'scroll'
    })
};
const view = (state$, config, methods) => xstream_1.default.combine(state$, config, ...methods).map(([{count}, config, ...methods]) => dom_1.div(`.${ styles.wrapper }`, [
    dom_1.div(`.${ styles.title }`, 'Instapy Tools GUI'),
    dom_1.div(`.${ styles.body }`, [
        dom_1.div(`.${ styles.methodsWrapper }`, methods),
        dom_1.div(`.${ styles.configWrapper }`, config)
    ])
]));
}
// default/src/api/index.js
$fsx.f[2] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const create_1 = $fsx.r(3);
const validate_1 = $fsx.r(4);
const method_1 = $fsx.r(6);
const raw_1 = $fsx.r(7);
const interface_1 = $fsx.r(8);
var interface_2 = $fsx.r(8);
exports.MethodComponentType = interface_2.MethodComponentType;
exports.ArgComponentType = interface_2.ArgComponentType;
exports.api = {
    setupCreate: create_1.setupCreate,
    setupValidateMethod: validate_1.setupValidateMethod,
    setupMethod: method_1.setupMethod,
    raw: raw_1.raw,
    setupInterface: interface_1.setupInterface,
    setupArgComponent: interface_1.setupArgComponent
};
}
// default/src/api/create.js
$fsx.f[3] = function(module,exports){
var __dirname = "src/api";
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = $fsx.r(114);
const defaultInstapyPath = `${ __dirname }/../../InstaPy`;
const importInstapy = 'from instapy import InstaPy';
exports.setupCreate = (projectPath = defaultInstapyPath) => (configLines, write = false, out = 'docker_quickstart.py') => {
    const config = [
        importInstapy,
        '\n',
        ...configLines
    ].join('\n') + '\n';
    if (write) {
        fs_1.writeFileSync(`${ projectPath }/${ out }`, config);
    }
    return config;
};
}
// default/src/api/validate.js
$fsx.f[4] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const types_1 = $fsx.r(5);
const gotBool = bool => (acc, curr) => curr === bool ? bool : acc;
const exists = apiJsonObj => ({
    arg: name => apiJsonObj.args[name] !== undefined,
    method: name => apiJsonObj.method[name] !== undefined
});
const typeToValidator = type => types_1.makeValidation(type);
const argTypeToValidator = apiArgs => rambda_1.map(typeToValidator, apiArgs);
const pickArgTypeValidators = apiArgs => argsToPick => rambda_1.compose(rambda_1.pick(argsToPick), argTypeToValidator)(apiArgs);
const allArgsExistOnMethod = (pickedArgs, args) => rambda_1.compose(rambda_1.reduce((acc, curr) => rambda_1.path(curr, pickedArgs) === undefined ? false : acc, true), keys)(args);
const keys = obj => Object.keys(obj);
const logIt = val => {
    console.log(val);
    return val;
};
exports.setupValidateMethod = apiJsonObj => ({name, args}) => {
    const pickedMethodArgs = rambda_1.compose(pickArgTypeValidators(apiJsonObj.args), keys, rambda_1.path(`methods.${ name }`))(apiJsonObj);
    if (allArgsExistOnMethod(pickedMethodArgs, args)) {
        const validatedList = rambda_1.compose(rambda_1.reduce(gotBool(false), true), rambda_1.values, rambda_1.map((val, key) => pickedMethodArgs[key](val)))(args);
        return validatedList;
    } else {
        return false;
    }
};
}
// default/src/utils/types.js
$fsx.f[5] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const ifValExists = (prop, val) => val === undefined ? {} : { [prop]: val };
exports.createType = {
    none: () => ({ _name: 'None' }),
    boolean: () => ({ _name: 'Boolean' }),
    string: () => ({ _name: 'String' }),
    number: ({step, min, max} = {}) => ({
        _name: 'Number',
        _constraints: {
            ...ifValExists('_step', step),
            ...ifValExists('_min', min),
            ...ifValExists('_max', max)
        }
    }),
    union: options => ({
        _name: 'Union',
        _options: options
    }),
    array: _type => ({
        _name: 'Array',
        _subType: _type
    }),
    tuple: types => ({
        _name: 'Tuple',
        _subTypes: types
    })
};
const isTypeReducer = _type => (acc, curr) => rambda_1.is(_type === 'String' ? String : Number, curr) ? acc : false;
const gotBool = bool => (acc, curr) => curr === bool ? bool : acc;
const executeValFunc = ([val, func]) => func(val);
const validateNone = val => val === null;
const validateBoolean = val => rambda_1.is(Boolean, val);
const validateString = val => rambda_1.is(String, val);
const validateNumber = ({_step, _min, _max}) => val => rambda_1.is(Number, val) && (_step === undefined || val % _step === 0) && (_min === undefined || val > _min) && (_max === undefined || val < _max);
const isExact = expected => got => rambda_1.equals(expected, got);
const toArray = input => [...input];
const validateUnion = options => val => {
    if (options.length === 0) {
        return true;
    } else {
        const typeValidators = rambda_1.compose(toArray, rambda_1.map(exports.makeValidation), rambda_1.reject(({_name}) => _name === undefined))(options);
        const exactValueValidators = rambda_1.compose(toArray, rambda_1.map(isExact), rambda_1.reject(({_name}) => _name !== undefined))(options);
        const validators = [
            ...typeValidators,
            ...exactValueValidators
        ];
        return rambda_1.anyPass(validators)(val);
    }
};
const validateArray = _type => val => {
    if (_type === 'String') {
        return val.reduce(isTypeReducer('String'), true);
    } else if (_type === 'Number') {
        return val.reduce(isTypeReducer('Number'), true);
    } else {
        return false;
    }
};
const validateTuple = typeList => val => {
    if (val.length === typeList.length) {
        return false;
    } else {
        return rambda_1.compose(rambda_1.reduce(gotBool(false), true), rambda_1.map(executeValFunc), rambda_1.zip(val), rambda_1.map(exports.makeValidation))(typeList);
    }
};
exports.makeDoAtType = ({_default, none, boolean, string, number, union, array, tuple}) => _type => _type._name === 'None' ? none : _type._name === 'Boolean' ? boolean : _type._name === 'String' ? string : _type._name === 'Number' ? number(_type._constraints) : _type._name === 'Union' ? union(_type._options) : _type._name === 'Array' ? array(_type._subType) : _type._name === 'Tuple' ? tuple(_type._subTypes) : _default;
exports.makeValidation = exports.makeDoAtType({
    _default: val => false,
    none: validateNone,
    boolean: validateBoolean,
    string: validateString,
    number: validateNumber,
    union: validateUnion,
    array: validateArray,
    tuple: validateTuple
});
}
// default/src/api/method.js
$fsx.f[6] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const types_1 = $fsx.r(5);
const execFnVal = ([val, fn]) => fn(val);
const addQuotes = (quoteChar, closeQoute) => str => `${ quoteChar }${ str }${ closeQoute ? closeQoute : quoteChar }`;
const addSingleQuotes = addQuotes(`'`);
const addBrackets = addQuotes('[', ']');
const addParenthesis = addQuotes('(', ')');
const toNone = () => 'None';
const toBool = bool => bool ? 'True' : 'False';
const toString = str => addSingleQuotes(str);
const toNumber = _ => num => `${ num }`;
const toPythonVal = val => val === null ? toNone() : rambda_1.is(Boolean, val) ? toBool(val) : rambda_1.is(String, val) ? toString(val) : rambda_1.is(Number, val) ? toNumber({})(val) : rambda_1.is(Array, val) ? toArray('String')(val) : toNone();
const toUnion = _ => union => toPythonVal(union);
const toArray = _ => arr => rambda_1.compose(addBrackets, rambda_1.join(', '), rambda_1.ifElse(rambda_1.is(String, arr[0]), rambda_1.map(addSingleQuotes), rambda_1.identity))(arr);
const toTuple = _subTypes => arr => rambda_1.compose(addParenthesis, rambda_1.join(', '), rambda_1.map(toPythonVal))(arr);
const argVal = types_1.makeDoAtType({
    _default: () => `Can't compute`,
    none: toNone,
    boolean: toBool,
    string: toString,
    number: toNumber,
    union: toUnion,
    array: toArray,
    tuple: toTuple
});
const affix = str1 => str2 => `${ str1 }${ str2 }`;
const doth = fn => val => {
    fn(val);
    return val;
};
const arg = apiJsonArgs => (val, argName) => rambda_1.compose(affix(argName), affix('='), argVal(apiJsonArgs[argName]))(val);
const log = val => {
    console.log(val);
    return val;
};
const toPythonArgs = apiJsonArgs => args => rambda_1.compose(addParenthesis, rambda_1.join(', '), rambda_1.values, rambda_1.map(arg(apiJsonArgs)))(args);
exports.setupMethod = (apiJsonObj, session = 'session') => ({name, args}) => rambda_1.compose(rambda_1.ifElse(name === '__init__', rambda_1.compose(affix(session), affix(' = '), affix('InstaPy')), rambda_1.compose(affix(session), affix('.'), affix(name))), toPythonArgs(apiJsonObj.args))(args);
}
// default/src/api/raw.js
$fsx.f[7] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
exports.raw = {
    'git': 'ef75ae17adece055960d010964602fef878b1958',
    'args': {
        'username': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'password': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'nogui': { '_name': 'Boolean' },
        'selenium_local_session': { '_name': 'Boolean' },
        'use_firefox': { '_name': 'Boolean' },
        'browser_profile_path': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'page_delay': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 0
            }
        },
        'show_logs': {
            '_name': 'Union',
            '_options': [
                { '_name': 'Boolean' },
                { '_name': 'None' }
            ]
        },
        'headless_browser': { '_name': 'Boolean' },
        'proxy_address': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'proxy_chrome_extension': { '_name': 'None' },
        'proxy_port': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 1,
                        '_max': 65535
                    }
                }
            ]
        },
        'bypass_suspicious_attempt': { '_name': 'Boolean' },
        'multi_logs': { '_name': 'Boolean' },
        'selenium_url': { '_name': 'String' },
        'percentage': {
            '_name': 'Union',
            '_options': [
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 0,
                        '_max': 100
                    }
                },
                { '_name': 'None' }
            ]
        },
        'enabled': {
            '_name': 'Union',
            '_options': [
                { '_name': 'Boolean' },
                { '_name': 'None' }
            ]
        },
        'comments': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'media': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Union',
                    '_options': [
                        'Photo',
                        'Video'
                    ]
                }
            ]
        },
        'times': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 1
            }
        },
        'tags': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'amount': {
            '_name': 'Union',
            '_options': [
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 1
                    }
                },
                { '_name': 'None' }
            ]
        },
        'randomize': { '_name': 'Boolean' },
        'users': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'words': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'friends': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'option': { '_name': 'Boolean' },
        'api_key': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'full_match': { '_name': 'Boolean' },
        'limit': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 1
            }
        },
        'sort': {
            '_name': 'Union',
            '_options': [
                'top',
                'random'
            ]
        },
        'log_tags': { '_name': 'Boolean' },
        'tags_skip': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'comment': { '_name': 'Boolean' },
        'usernames': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'daysold': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 0
            }
        },
        'max_pic': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 1
            }
        },
        'sleep_delay': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 0
            }
        },
        'interact': { '_name': 'Boolean' },
        'photos_grab_amount': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 1
            }
        },
        'follow_likers_per_photo': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 0
            }
        },
        'followlist': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'potency_ratio': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 0.01,
                        '_min': 0
                    }
                }
            ]
        },
        'delimit_by_numbers': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'Boolean' }
            ]
        },
        'max_followers': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 1
                    }
                }
            ]
        },
        'max_following': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 1
                    }
                }
            ]
        },
        'min_followers': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 0
                    }
                }
            ]
        },
        'min_following': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 0
                    }
                }
            ]
        },
        'max': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 1
                    }
                }
            ]
        },
        'min': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 0
                    }
                }
            ]
        },
        'locations': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                }
            ]
        },
        'skip_top_posts': { '_name': 'Boolean' },
        'use_smart_hashtags': { '_name': 'Boolean' },
        'url': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'customList': {
            '_name': 'Tuple',
            '_subTypes': [
                { '_name': 'Boolean' },
                {
                    '_name': 'Array',
                    '_subType': 'String'
                },
                {
                    '_name': 'Union',
                    '_options': [
                        'all',
                        'nonfollowers'
                    ]
                }
            ]
        },
        'InstapyFollowed': {
            '_name': 'Tuple',
            '_subTypes': [
                { '_name': 'Boolean' },
                {
                    '_name': 'Union',
                    '_options': [
                        'all',
                        'nonfollowers'
                    ]
                }
            ]
        },
        'nonFollowers': { '_name': 'Boolean' },
        'allFollowing': { '_name': 'Boolean' },
        'style': {
            '_name': 'Union',
            '_options': [
                'FIFO',
                'LIFO',
                'RANDOM'
            ]
        },
        'unfollow_after': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                {
                    '_name': 'Number',
                    '_constraints': {
                        '_step': 1,
                        '_min': 0
                    }
                }
            ]
        },
        'unfollow': { '_name': 'Boolean' },
        'posts': {
            '_name': 'Number',
            '_constraints': {
                '_step': 1,
                '_min': 1
            }
        },
        'boundary': {
            '_name': 'Number',
            '_constraints': {}
        },
        'campaign': {
            '_name': 'Union',
            '_options': [
                { '_name': 'None' },
                { '_name': 'String' }
            ]
        },
        'live_match': { '_name': 'Boolean' },
        'store_locally': { '_name': 'Boolean' },
        'compare_by': {
            '_name': 'Union',
            '_options': [
                'latest',
                'earliest',
                'day',
                'month',
                'year'
            ]
        },
        'compare_track': {
            '_name': 'Union',
            '_options': [
                'first',
                'median',
                'last'
            ]
        },
        'print_out': { '_name': 'Boolean' },
        'urls': {
            '_name': 'Array',
            '_subType': 'String'
        }
    },
    'methods': {
        '__init__': {
            'username': null,
            'password': null,
            'nogui': false,
            'selenium_local_session': true,
            'use_firefox': false,
            'browser_profile_path': null,
            'page_delay': 25,
            'show_logs': true,
            'headless_browser': false,
            'proxy_address': null,
            'proxy_chrome_extension': null,
            'proxy_port': null,
            'bypass_suspicious_attempt': false,
            'multi_logs': false
        },
        'get_instapy_logger': { 'show_logs': null },
        'set_selenium_local_session': {},
        'set_selenium_remote_session': { 'selenium_url': '' },
        'login': {},
        'set_sleep_reduce': { 'percentage': null },
        'set_do_comment': {
            'enabled': false,
            'percentage': 0
        },
        'set_comments': {
            'comments': null,
            'media': null
        },
        'set_do_follow': {
            'enabled': false,
            'percentage': 0,
            'times': 1
        },
        'set_do_like': {
            'enabled': false,
            'percentage': 0
        },
        'set_dont_like': { 'tags': null },
        'set_mandatory_words': { 'tags': null },
        'set_user_interact': {
            'amount': 10,
            'percentage': 100,
            'randomize': false,
            'media': null
        },
        'set_ignore_users': { 'users': null },
        'set_ignore_if_contains': { 'words': null },
        'set_dont_include': { 'friends': null },
        'set_switch_language': { 'option': true },
        'set_use_clarifai': {
            'enabled': false,
            'api_key': null,
            'full_match': false
        },
        'set_smart_hashtags': {
            'tags': null,
            'limit': 3,
            'sort': 'top',
            'log_tags': true
        },
        'clarifai_check_img_for': {
            'tags': null,
            'tags_skip': null,
            'comment': false,
            'comments': null
        },
        'follow_commenters': {
            'usernames': null,
            'amount': 10,
            'daysold': 365,
            'max_pic': 50,
            'sleep_delay': 600,
            'interact': false
        },
        'follow_likers ': {
            'usernames': null,
            'photos_grab_amount': 3,
            'follow_likers_per_photo': 3,
            'randomize': true,
            'sleep_delay': 600,
            'interact': false
        },
        'follow_by_list': {
            'followlist': null,
            'times': 1,
            'sleep_delay': 600,
            'interact': false
        },
        'set_relationship_bounds ': {
            'enabled': null,
            'potency_ratio': null,
            'delimit_by_numbers': null,
            'max_followers': null,
            'max_following': null,
            'min_followers': null,
            'min_following': null
        },
        'set_delimit_liking': {
            'enabled': null,
            'max': null,
            'min': null
        },
        'set_delimit_commenting': {
            'enabled': false,
            'max': null,
            'min': null
        },
        'set_simulation': {
            'enabled': true,
            'percentage': 100
        },
        'like_by_locations': {
            'locations': null,
            'amount': 50,
            'media': null,
            'skip_top_posts': true
        },
        'comment_by_locations': {
            'locations': null,
            'amount': 50,
            'media': null,
            'skip_top_posts': true
        },
        'like_by_tags': {
            'tags': null,
            'amount': 50,
            'skip_top_posts': true,
            'use_smart_hashtags': false,
            'interact': false,
            'randomize': false,
            'media': null
        },
        'like_by_users': {
            'usernames': null,
            'amount': 10,
            'randomize': false,
            'media': null
        },
        'interact_by_users': {
            'usernames': null,
            'amount': 10,
            'randomize': false,
            'media': null
        },
        'like_from_image': {
            'url': null,
            'amount': 50,
            'media': null
        },
        'interact_user_followers': {
            'usernames': null,
            'amount': 10,
            'randomize': false
        },
        'interact_user_following': {
            'usernames': null,
            'amount': 10,
            'randomize': false
        },
        'follow_user_followers': {
            'usernames': null,
            'amount': 10,
            'randomize': false,
            'interact': false,
            'sleep_delay': 600
        },
        'follow_user_following': {
            'usernames': null,
            'amount': 10,
            'randomize': false,
            'interact': false,
            'sleep_delay': 600
        },
        'unfollow_users': {
            'amount': 10,
            'customList': [
                false,
                [],
                'all'
            ],
            'InstapyFollowed': [
                false,
                'all'
            ],
            'nonFollowers': false,
            'allFollowing': false,
            'style': 'FIFO',
            'unfollow_after': null,
            'sleep_delay': 600
        },
        'like_by_feed': {
            'amount': 50,
            'randomize': false,
            'unfollow': false,
            'interact': false
        },
        'set_dont_unfollow_active_users': {
            'enabled': false,
            'posts': 4,
            'boundary': 500
        },
        'set_blacklist': {
            'enabled': null,
            'campaign': null
        },
        'grab_followers': {
            'username': null,
            'amount': null,
            'live_match': false,
            'store_locally': true
        },
        'grab_following': {
            'username': null,
            'amount': null,
            'live_match': false,
            'store_locally': true
        },
        'pick_unfollowers': {
            'username': null,
            'compare_by': 'latest',
            'compare_track': 'first',
            'live_match': false,
            'store_locally': true,
            'print_out': true
        },
        'pick_nonfollowers': {
            'username': null,
            'live_match': false,
            'store_locally': true
        },
        'pick_fans': {
            'username': null,
            'live_match': false,
            'store_locally': true
        },
        'pick_mutual_following': {
            'username': null,
            'live_match': false,
            'store_locally': true
        },
        'end': {},
        'follow_by_tags': {
            'tags': null,
            'amount': 50,
            'skip_top_posts': true,
            'use_smart_hashtags': false,
            'randomize': false,
            'media': null
        },
        'interact_by_URL': {
            'urls': [],
            'randomize': false,
            'interact': false
        }
    }
};
}
// default/src/api/interface.js
$fsx.f[8] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const types_1 = $fsx.r(5);
const buildArg = argsTypes => (def, argName) => argsTypes[argName](def, argName);
const buildMethodWithArgs = (methodComponent, argsTypes) => (argsMethod, methodName) => {
    const buildedArgs = rambda_1.map(buildArg(argsTypes), argsMethod);
    return methodComponent(buildedArgs, methodName);
};
exports.setupArgComponent = types_1.makeDoAtType;
exports.setupInterface = ({args, methods}, methodComponent, argComponent) => {
    const argToTypeFns = rambda_1.map(argComponent, args);
    const buildedComponents = rambda_1.map(buildMethodWithArgs(methodComponent, argToTypeFns), methods);
    return buildedComponents;
};
}
// default/docSrc/src/components/arg.js
$fsx.f[9] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const isolate_1 = $fsx.r(94);
const api_1 = $fsx.r(2);
const rambda_1 = $fsx.r(117);
const input_none_1 = $fsx.r(10);
const input_boolean_1 = $fsx.r(16);
const input_string_1 = $fsx.r(21);
const input_number_1 = $fsx.r(26);
const input_array_1 = $fsx.r(31);
const input_tuple_1 = $fsx.r(36);
const input_union_1 = $fsx.r(41);
const {setupArgComponent} = api_1.api;
const includeValue = (argName, parentState, childState) => ({
    value: childState.isIncluded ? {
        ...parentState.value,
        [argName]: childState.value
    } : rambda_1.omit(argName, parentState.value)
});
const includeValueUnion = (argName, def, active, parentState, childState) => ({
    value: childState.isIncluded ? {
        ...parentState.value,
        [argName]: childState[`_${ active }`] === undefined ? def : childState[`_${ active }`].value
    } : rambda_1.omit(argName, parentState.value)
});
const defaultLens = (def, argName, _) => ({
    get: parentState => ({
        ...parentState[`_${ argName }`],
        _default: def,
        name: argName,
        value: rambda_1.pathOr(def, [
            `_${ argName }`,
            'value'
        ], parentState)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ argName }`]: childState,
        ...includeValue(argName, parentState, childState)
    })
});
const maybeObject = (key, value) => value === undefined ? {} : { [key]: value };
const numberLens = (def, argName, {_step, _min, _max}) => ({
    get: parentState => ({
        ...parentState[`_${ argName }`],
        _default: def,
        name: argName,
        value: rambda_1.pathOr(def, [
            `_${ argName }`,
            'value'
        ], parentState),
        ...maybeObject('step', _step),
        ...maybeObject('min', _min),
        ...maybeObject('max', _max)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ argName }`]: childState,
        ...includeValue(argName, parentState, childState)
    })
});
const unionLens = (def, argName) => ({
    get: parentState => ({
        ...parentState[`_${ argName }`],
        _default: def,
        name: argName,
        value: rambda_1.pathOr(def, [
            `_${ argName }`,
            'value'
        ], parentState)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ argName }`]: childState,
        ...includeValueUnion(argName, def, childState.active, parentState, childState)
    })
});
const argIsolate = (component, lens, _sub = undefined) => (def, argName) => isolate_1.default(component, {
    onion: lens(def, argName, _sub),
    '*': argName
});
exports.Arg = ({_default = defaultLens, none = defaultLens, boolean = defaultLens, string = defaultLens, number = numberLens, array = defaultLens, tuple = defaultLens, union = unionLens}) => setupArgComponent({
    _default: argIsolate(input_none_1.inputNone, _default),
    none: argIsolate(input_none_1.inputNone, none),
    boolean: argIsolate(input_boolean_1.inputBoolean, boolean),
    string: argIsolate(input_string_1.inputString, string),
    number: _constraints => argIsolate(input_number_1.inputNumber, number, _constraints),
    array: () => argIsolate(input_array_1.inputArray, array),
    tuple: _subTypes => argIsolate(input_tuple_1.inputTuple(_subTypes), tuple),
    union: _options => argIsolate(input_union_1.inputUnion(_options), union)
});
}
// default/docSrc/src/components/input-none/index.js
$fsx.f[10] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(11);
const view_1 = $fsx.r(12);
const types_1 = $fsx.r(15);
exports.State = types_1.State;
const inputNone = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputNone = inputNone;
}
// default/docSrc/src/components/input-none/intent.js
$fsx.f[11] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: '',
    isIncluded: false,
    value: null,
    _default: null
};
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    return xstream_1.default.merge(init$, include$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-none/view.js
$fsx.f[12] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(13);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value, _default}) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.paragraph]: true,
            [styles.hidden]: !isIncluded
        }
    }, 'None')
]);
const view = state$ => state$.map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-none/styles.js
$fsx.f[13] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const paragraph = typestyle_1.style({ color: '#444' });
exports.paragraph = paragraph;
}
// default/docSrc/src/utils/must.js
$fsx.f[14] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const mustObject = (condition, [key, value]) => condition ? { [key]: value } : {};
exports.mustObject = mustObject;
const mustArray = (condition, val) => condition ? [val] : [];
exports.mustArray = mustArray;
}
// default/docSrc/src/components/input-none/types.js
$fsx.f[15] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-boolean/index.js
$fsx.f[16] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(17);
const view_1 = $fsx.r(18);
const types_1 = $fsx.r(20);
exports.State = types_1.State;
const inputBoolean = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputBoolean = inputBoolean;
}
// default/docSrc/src/components/input-boolean/intent.js
$fsx.f[17] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: '',
    isIncluded: false,
    value: false,
    _default: false
};
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    const flip$ = DOM.select('div[data-flip]').events('click').mapTo(prev => ({
        ...prev,
        value: !prev.value
    }));
    return xstream_1.default.merge(init$, include$, flip$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-boolean/view.js
$fsx.f[18] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(19);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value}) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.bool]: true,
            [styles.on]: value,
            [styles.hidden]: !isIncluded
        },
        dataset: { flip: true }
    }, value ? 'True' : 'False')
]);
const view = state$ => state$.map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-boolean/styles.js
$fsx.f[19] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const bool = typestyle_1.style({
    color: '#fff',
    textAlign: 'center',
    padding: '.4em',
    background: '#777'
});
exports.bool = bool;
const on = typestyle_1.style({ background: '#3c3' });
exports.on = on;
}
// default/docSrc/src/components/input-boolean/types.js
$fsx.f[20] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-string/index.js
$fsx.f[21] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(22);
const view_1 = $fsx.r(23);
const types_1 = $fsx.r(25);
exports.State = types_1.State;
const inputString = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputString = inputString;
}
// default/docSrc/src/components/input-string/intent.js
$fsx.f[22] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const rambda_1 = $fsx.r(117);
const defaultState = {
    name: '',
    isIncluded: false,
    value: '',
    _default: ''
};
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    const input$ = DOM.select('input').events('input').map(rambda_1.path('target.value')).map(newValue => prevState => ({
        ...prevState,
        value: newValue
    }));
    return xstream_1.default.merge(init$, include$, input$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-string/view.js
$fsx.f[23] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(24);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value}) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.input({
        class: {
            [styles.input]: true,
            [styles.hidden]: !isIncluded
        }
    }, { props: { value: value } })
]);
const view = state$ => state$.map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-string/styles.js
$fsx.f[24] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const input = typestyle_1.style({ color: '#444' });
exports.input = input;
}
// default/docSrc/src/components/input-string/types.js
$fsx.f[25] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-number/index.js
$fsx.f[26] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(27);
const view_1 = $fsx.r(28);
const types_1 = $fsx.r(30);
exports.State = types_1.State;
const inputNumber = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputNumber = inputNumber;
}
// default/docSrc/src/components/input-number/intent.js
$fsx.f[27] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const rambda_1 = $fsx.r(117);
const defaultState = {
    name: '',
    isIncluded: false,
    value: 1,
    _default: 1,
    step: 1,
    min: -99999,
    max: 99999
};
const maxRange = max => value => value > max ? max : value;
const minRange = min => value => value < min ? min : value;
const keepInRange = (min, max) => rambda_1.compose(maxRange(max), minRange(min));
const keepValidNumber = (min, max, _default) => rambda_1.ifElse(isNaN, () => _default, keepInRange(min, max));
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    const input$ = DOM.select('input').events('input').map(rambda_1.path('target.value')).map(Number).map(newValue => prevState => ({
        ...prevState,
        value: keepValidNumber(prevState.min, prevState.max, prevState._default)(newValue)
    }));
    return xstream_1.default.merge(init$, include$, input$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-number/view.js
$fsx.f[28] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(29);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value, step}) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.wrapper]: true,
            [styles.hidden]: !isIncluded
        }
    }, [
        dom_1.input({
            class: { [styles.input]: true },
            props: {
                value: value,
                type: 'number',
                step: step
            }
        }),
        dom_1.div(`.${ styles.value }`, value)
    ])
]);
const view = state$ => state$.map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-number/styles.js
$fsx.f[29] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const wrapper = typestyle_1.style({ justifyContent: 'space-between' }, csstips_1.horizontal);
exports.wrapper = wrapper;
const input = typestyle_1.style({ color: '#444' });
exports.input = input;
const value = typestyle_1.style({ color: '#222' });
exports.value = value;
}
// default/docSrc/src/components/input-number/types.js
$fsx.f[30] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-array/index.js
$fsx.f[31] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(32);
const view_1 = $fsx.r(33);
const types_1 = $fsx.r(35);
exports.State = types_1.State;
const inputArray = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputArray = inputArray;
}
// default/docSrc/src/components/input-array/intent.js
$fsx.f[32] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const rambda_1 = $fsx.r(117);
const defaultState = {
    name: '',
    isIncluded: false,
    value: [],
    _default: []
};
const filterOut = rambda_1.compose(rambda_1.reject, rambda_1.equals);
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    const input$ = DOM.select('textarea').events('input').map(rambda_1.path('target.value')).map(rambda_1.replace(/#/g, ' #')).map(rambda_1.split(' ')).map(filterOut('')).map(filterOut('#')).map(newValue => prevState => ({
        ...prevState,
        value: newValue
    }));
    return xstream_1.default.merge(init$, include$, input$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-array/view.js
$fsx.f[33] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(34);
const rambda_1 = $fsx.r(117);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value}) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.textarea({
        class: {
            [styles.textarea]: true,
            [styles.hidden]: !isIncluded
        },
        props: { value: value }
    })
]);
const view = state$ => state$.map(state => ({
    ...state,
    value: rambda_1.join(' ', state.value)
})).map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-array/styles.js
$fsx.f[34] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const textarea = typestyle_1.style({ color: '#444' });
exports.textarea = textarea;
}
// default/docSrc/src/components/input-array/types.js
$fsx.f[35] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-tuple/index.js
$fsx.f[36] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(37);
const view_1 = $fsx.r(38);
const types_1 = $fsx.r(40);
exports.State = types_1.State;
const rambda_1 = $fsx.r(117);
const arg_1 = $fsx.r(9);
const must_1 = $fsx.r(14);
const defaultLens = (_0, key, _1) => ({
    get: parentState => ({
        ...parentState[`_${ key }`],
        isIncluded: true,
        _default: parentState._default[key],
        value: rambda_1.pathOr(parentState._default[key], [
            `_${ key }`,
            'value'
        ], parentState)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ key }`]: childState,
        value: rambda_1.update(key, childState.value, parentState.value)
    })
});
const numberLens = (_, key, {_step, _min, _max}) => ({
    get: parentState => ({
        ...parentState[`_${ key }`],
        isIncluded: true,
        _default: parentState._default[key],
        value: rambda_1.pathOr(parentState._default[key], [
            `_${ key }`,
            'value'
        ], parentState),
        ...must_1.mustObject(_step === undefined, [
            'step',
            _step
        ]),
        ...must_1.mustObject(_min === undefined, [
            'min',
            _min
        ]),
        ...must_1.mustObject(_max === undefined, [
            'max',
            _max
        ])
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ key }`]: childState,
        value: rambda_1.update(key, childState.value, parentState.value)
    })
});
const unionLens = (_, key) => ({
    get: parentState => ({
        ...parentState[`_${ key }`],
        isIncluded: true,
        _default: parentState._default[key],
        value: rambda_1.pathOr(parentState._default[key], [
            `_${ key }`,
            'value'
        ], parentState)
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ key }`]: childState,
        value: rambda_1.update(key, childState[`_${ childState.active }`] === undefined ? parentState._default[key] : childState[`_${ childState.active }`].value, parentState.value)
    })
});
const compList = childComponents => ({DOM, onion}) => {
    const childComponentsSinks = rambda_1.map(component => component({
        DOM,
        onion
    }), childComponents);
    const childComponentsDOM = rambda_1.map(rambda_1.path('DOM'), childComponentsSinks);
    const childComponentsOnion = rambda_1.map(rambda_1.path('onion'), childComponentsSinks);
    return {
        DOM: childComponentsDOM,
        onion: childComponentsOnion
    };
};
const inputTuple = _subTypes => ({DOM, onion}) => {
    const childComponents = rambda_1.compose(rambda_1.map(([index, makeComponent]) => makeComponent(null, index)), rambda_1.zip([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ]), rambda_1.map(arg_1.Arg({
        _default: defaultLens,
        none: defaultLens,
        boolean: defaultLens,
        string: defaultLens,
        number: numberLens,
        array: defaultLens,
        tuple: defaultLens,
        union: unionLens
    })))(_subTypes);
    const childComponentsSinks = compList(childComponents)({
        DOM,
        onion
    });
    return {
        DOM: view_1.view(onion.state$, childComponentsSinks.DOM),
        onion: intent_1.intent(DOM, childComponentsSinks.onion)
    };
};
exports.inputTuple = inputTuple;
}
// default/docSrc/src/components/input-tuple/intent.js
$fsx.f[37] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: '',
    isIncluded: false,
    value: [],
    _default: []
};
const intent = (DOM, childComponents) => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    return xstream_1.default.merge(init$, include$, ...childComponents);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-tuple/view.js
$fsx.f[38] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const dom_1 = $fsx.r(74);
const styles = $fsx.r(39);
const must_1 = $fsx.r(14);
const dom = ([{name, isIncluded}, childComponents]) => dom_1.div(`.${ styles.container }`, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.args]: true,
            [styles.hidden]: !isIncluded
        }
    }, childComponents)
]);
const headTailPair = ([head, ...tail]) => [
    head,
    tail
];
const view = (state$, childComponents) => xstream_1.default.combine(state$, ...childComponents).map(headTailPair).map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-tuple/styles.js
$fsx.f[39] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const args = typestyle_1.style({ color: '#444' });
exports.args = args;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
}
// default/docSrc/src/components/input-tuple/types.js
$fsx.f[40] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-union/index.js
$fsx.f[41] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const isolate_1 = $fsx.r(94);
const intent_1 = $fsx.r(42);
const view_1 = $fsx.r(43);
const types_1 = $fsx.r(45);
exports.State = types_1.State;
const arg_1 = $fsx.r(9);
const input_constant_1 = $fsx.r(46);
const rambda_1 = $fsx.r(117);
const defaultLens = (def, index) => ({
    get: parentState => ({
        ...parentState[`_${ index }`],
        isIncluded: true
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ index }`]: childState
    })
});
const constantComponentLens = (value, index) => ({
    get: parentState => ({
        ...parentState[`_${ index }`],
        isIncluded: true,
        value: value,
        _default: value
    }),
    set: (parentState, childState) => ({
        ...parentState,
        [`_${ index }`]: childState
    })
});
const constantIsolate = value => (_, index) => isolate_1.default(input_constant_1.inputConstant, {
    onion: constantComponentLens(value, index),
    '*': index
});
const compList = childComponents => ({DOM, onion}) => {
    const childComponentsSinks = rambda_1.map(component => component({
        DOM,
        onion
    }), childComponents);
    const childComponentsDOM = rambda_1.map(rambda_1.path('DOM'), childComponentsSinks);
    const childComponentsOnion = rambda_1.map(rambda_1.path('onion'), childComponentsSinks);
    return {
        DOM: childComponentsDOM,
        onion: childComponentsOnion
    };
};
const isDynamic = value => typeof value === 'object' && value._name !== undefined;
const toArray = arr => [...arr];
const inputUnion = _options => ({DOM, onion}) => {
    const constantChildComponents = rambda_1.compose(toArray, rambda_1.map(constantIsolate), rambda_1.reject(isDynamic))(_options);
    const dynamicChildComponents = rambda_1.compose(toArray, rambda_1.map(arg_1.Arg({
        _default: defaultLens,
        none: defaultLens,
        boolean: defaultLens,
        string: defaultLens,
        number: defaultLens,
        array: defaultLens,
        tuple: defaultLens,
        union: defaultLens
    })), rambda_1.filter(isDynamic))(_options);
    const childComponents = rambda_1.compose(rambda_1.map(([index, makeComponent]) => makeComponent(null, index)), rambda_1.zip([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
    ]))([
        ...constantChildComponents,
        ...dynamicChildComponents
    ]);
    const childComponentsSinks = compList(childComponents)({
        DOM,
        onion
    });
    return {
        DOM: view_1.view(onion.state$, childComponentsSinks.DOM),
        onion: intent_1.intent(DOM, childComponentsSinks.onion)
    };
};
exports.inputUnion = inputUnion;
}
// default/docSrc/src/components/input-union/intent.js
$fsx.f[42] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const rambda_1 = $fsx.r(117);
const defaultState = {
    name: '',
    isIncluded: false,
    value: '',
    active: 0,
    pickListOpen: false
};
const intent = (DOM, components) => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const pick$ = DOM.select('div[data-pick]').events('click').map(rambda_1.path('target.dataset.pick')).map(newActive => prevState => ({
        ...prevState,
        active: newActive
    }));
    const openPickList$ = DOM.select('div[data-pick-open]').events('click').mapTo(prevState => ({
        ...prevState,
        pickListOpen: true
    }));
    const closePickList$ = pick$.mapTo(prevState => ({
        ...prevState,
        pickListOpen: false
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    return xstream_1.default.merge(init$, include$, pick$, openPickList$, closePickList$, ...components);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-union/view.js
$fsx.f[43] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const dom_1 = $fsx.r(74);
const styles = $fsx.r(44);
const rambda_1 = $fsx.r(117);
const must_1 = $fsx.r(14);
const iMap = rambda_1.addIndex(rambda_1.map);
const pickList = childComponents => iMap((childComponent, index) => dom_1.div({ class: { [styles.pickWrapper]: true } }, [
    childComponent,
    dom_1.div({
        class: { [styles.pick]: true },
        dataset: { pick: `${ index }` }
    })
]), childComponents);
const showOnlyActive = (childComponents, active) => iMap((childComponent, index) => dom_1.div({ class: { [styles.hidden]: `${ active }` !== `${ index }` } }, childComponent), childComponents);
const dom = ([{name, active, pickListOpen, isIncluded}, childComponents]) => dom_1.div({ class: { [styles.container]: true } }, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.childWrapper]: true,
            [styles.hidden]: !isIncluded
        }
    }, [
        dom_1.div({
            class: {
                [styles.hidden]: pickListOpen,
                [styles.open]: true
            },
            dataset: { pickOpen: true }
        }, '^'),
        dom_1.div({
            class: {
                [styles.pickListWrapper]: true,
                [styles.hidden]: !pickListOpen
            }
        }, pickList(childComponents)),
        dom_1.div({ class: { [styles.hidden]: pickListOpen } }, showOnlyActive(childComponents, active))
    ])
]);
const headTailPair = ([head, ...tail]) => [
    head,
    tail
];
const view = (state$, childComponents) => xstream_1.default.combine(state$, ...childComponents).map(headTailPair).map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-union/styles.js
$fsx.f[44] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const childWrapper = typestyle_1.style({ color: '#444' });
exports.childWrapper = childWrapper;
const pickListWrapper = typestyle_1.style({});
exports.pickListWrapper = pickListWrapper;
const pickWrapper = typestyle_1.style({ position: 'relative' });
exports.pickWrapper = pickWrapper;
const pick = typestyle_1.style({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: '#ccc2',
    $nest: { '&:hover': { background: '#ccc8' } }
});
exports.pick = pick;
const open = typestyle_1.style({
    transform: 'rotateX(180deg)',
    padding: '.4em',
    textAlign: 'center',
    background: '#555',
    color: 'white',
    $nest: { '&:hover': { background: '#bbb' } }
});
exports.open = open;
}
// default/docSrc/src/components/input-union/types.js
$fsx.f[45] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/input-constant/index.js
$fsx.f[46] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(47);
const view_1 = $fsx.r(48);
const types_1 = $fsx.r(50);
exports.State = types_1.State;
const inputConstant = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.inputConstant = inputConstant;
}
// default/docSrc/src/components/input-constant/intent.js
$fsx.f[47] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: '',
    isIncluded: false,
    value: null,
    _default: null
};
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    return xstream_1.default.merge(init$, include$);
};
exports.intent = intent;
}
// default/docSrc/src/components/input-constant/view.js
$fsx.f[48] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const dom_1 = $fsx.r(74);
const styles = $fsx.r(49);
const must_1 = $fsx.r(14);
const dom = ({name, isIncluded, value, _default}) => dom_1.div({ class: { [styles.container]: true } }, [
    ...must_1.mustArray(name !== '', dom_1.div({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.included]: isIncluded
        }
    }, name)),
    dom_1.div({
        class: {
            [styles.paragraph]: true,
            [styles.hidden]: !isIncluded
        }
    }, value)
]);
const view = state$ => state$.map(dom);
exports.view = view;
}
// default/docSrc/src/components/input-constant/styles.js
$fsx.f[49] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    fontSize: '1.2em',
    background: '#bbb',
    color: 'white',
    padding: '.2em',
    marginBottom: '.2em'
});
exports.name = name;
const hidden = typestyle_1.style({ display: 'none' });
exports.hidden = hidden;
const included = typestyle_1.style({ background: '#6c6' });
exports.included = included;
const paragraph = typestyle_1.style({ color: '#444' });
exports.paragraph = paragraph;
}
// default/docSrc/src/components/input-constant/types.js
$fsx.f[50] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/method/index.js
$fsx.f[51] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(52);
const view_1 = $fsx.r(53);
const types_1 = $fsx.r(55);
exports.State = types_1.State;
const rambda_1 = $fsx.r(117);
const compList = childComponents => ({DOM, onion}) => {
    const childComponentsSinks = rambda_1.map(component => component({
        DOM,
        onion
    }), rambda_1.values(childComponents));
    const childComponentsDOM = rambda_1.map(rambda_1.path('DOM'), childComponentsSinks);
    const childComponentsOnion = rambda_1.map(rambda_1.path('onion'), childComponentsSinks);
    return {
        DOM: childComponentsDOM,
        onion: childComponentsOnion
    };
};
const method = (childComponents = {}) => ({DOM, onion}) => {
    const childComponentsSinks = compList(childComponents)({
        DOM,
        onion
    });
    return {
        DOM: view_1.view(onion.state$, childComponentsSinks.DOM),
        onion: intent_1.intent(DOM, childComponentsSinks.onion)
    };
};
exports.method = method;
}
// default/docSrc/src/components/method/intent.js
$fsx.f[52] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: 'Method',
    isIncluded: false
};
const intent = (DOM, childComponentOnion) => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    const include$ = DOM.select('[data-include]').events('click').mapTo(prevState => ({
        ...prevState,
        isIncluded: !prevState.isIncluded
    }));
    return xstream_1.default.merge(init$, include$, ...childComponentOnion);
};
exports.intent = intent;
}
// default/docSrc/src/components/method/view.js
$fsx.f[53] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const dom_1 = $fsx.r(74);
const styles = $fsx.r(54);
const must_1 = $fsx.r(14);
const dom = ([{name, isIncluded}, childComponents]) => dom_1.div(`.${ styles.container }`, [
    dom_1.h2({
        dataset: { include: true },
        class: {
            [styles.name]: true,
            [styles.includeTrue]: isIncluded
        }
    }, name),
    ...must_1.mustArray(isIncluded, dom_1.div(childComponents))
]);
const headTailPair = ([head, ...tail]) => [
    head,
    tail
];
const view = (state$, childComponentsDOM) => xstream_1.default.combine(state$, ...childComponentsDOM).map(headTailPair).map(dom);
exports.view = view;
}
// default/docSrc/src/components/method/styles.js
$fsx.f[54] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em',
    fontSize: '.8em'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({
    color: 'white',
    background: '#ccc',
    padding: '.4em'
});
exports.name = name;
const includeTrue = typestyle_1.style({ background: '#3c3' });
exports.includeTrue = includeTrue;
}
// default/docSrc/src/components/method/types.js
$fsx.f[55] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// default/docSrc/src/components/config-out/index.js
$fsx.f[56] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const intent_1 = $fsx.r(57);
const view_1 = $fsx.r(58);
const types_1 = $fsx.r(73);
exports.State = types_1.State;
const configOut = ({DOM, onion}) => ({
    DOM: view_1.view(onion.state$),
    onion: intent_1.intent(DOM)
});
exports.configOut = configOut;
}
// default/docSrc/src/components/config-out/intent.js
$fsx.f[57] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const xstream_1 = $fsx.r(148);
const defaultState = {
    name: 'Python conf',
    methods: {}
};
const intent = DOM => {
    const init$ = xstream_1.default.of(prev => ({
        ...defaultState,
        ...prev
    }));
    return init$;
};
exports.intent = intent;
}
// default/docSrc/src/components/config-out/view.js
$fsx.f[58] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const throttle_1 = $fsx.r(152);
const dom_1 = $fsx.r(74);
const styles = $fsx.r(59);
const rambda_1 = $fsx.r(117);
const src_1 = $fsx.r(60);
const {raw, setupMethod} = src_1.api;
const pyMethod = setupMethod(raw);
const dom = ({name, config}) => dom_1.div(`.${ styles.container }`, [
    dom_1.h2(`.${ styles.name }`, name),
    dom_1.pre(`.${ styles.config }`, config)
]);
const lY = prefix => val => {
    console.log(prefix);
    console.log(val);
    return val;
};
const methodsToConfig = rambda_1.compose(rambda_1.join('\n'), rambda_1.map(pyMethod), rambda_1.values, rambda_1.map((args, methodName) => ({
    name: methodName,
    args: args
})));
const toConfigReducer = fromState => ({
    ...fromState,
    config: rambda_1.ifElse(rambda_1.equals({}), _ => 'Please check a method', methodsToConfig)(fromState.methods)
});
const view = state$ => state$.compose(throttle_1.default(60)).map(toConfigReducer).map(dom);
exports.view = view;
}
// default/docSrc/src/components/config-out/styles.js
$fsx.f[59] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const typestyle_1 = $fsx.r(143);
const csstips_1 = $fsx.r(98);
const container = typestyle_1.style({
    borderStyle: 'solid',
    padding: '.4em',
    overflowY: 'scroll',
    maxHeight: '90vh'
}, csstips_1.vertical);
exports.container = container;
const name = typestyle_1.style({ color: '#222' });
exports.name = name;
const config = typestyle_1.style({
    fontSize: '.6em',
    backgroundColor: '#225',
    color: 'white',
    padding: '.2em',
    overflowX: 'hidden'
});
exports.config = config;
}
// default/src/index.js
$fsx.f[60] = function(module,exports){
function __export(m) {
    for (var p in m)
        if (!exports.hasOwnProperty(p))
            exports[p] = m[p];
}
Object.defineProperty(exports, '__esModule', { value: true });
__export($fsx.r(61));
__export($fsx.r(67));
__export($fsx.r(2));
const types_1 = $fsx.r(5);
exports.Type = types_1.Type;
}
// default/src/gen/index.js
$fsx.f[61] = function(module,exports){
var __dirname = "src/gen";
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = $fsx.r(97);
const fs_1 = $fsx.r(114);
const rambda_1 = $fsx.r(117);
const trim_1 = $fsx.r(62);
const extract_1 = $fsx.r(64);
const suplement_1 = $fsx.r(65);
const format_1 = $fsx.r(66);
const defaultInstapyPath = `${ __dirname }/../../InstaPy`;
const getInstapyHash = projectPath => child_process_1.execSync(`cd ${ projectPath }; git rev-parse HEAD`).toString('utf8').split('\n')[0];
const addGitHash = projectPath => api => ({
    git: getInstapyHash(projectPath),
    ...api
});
const getRawInstapy = projectPath => fs_1.readFileSync(`${ projectPath }/instapy/instapy.py`, 'utf-8');
exports.genApi = (projectPath = defaultInstapyPath) => rambda_1.pipe(trim_1.trimExcessData, extract_1.extract, suplement_1.suplement, format_1.format, addGitHash(projectPath))(getRawInstapy(projectPath));
}
// default/src/gen/trim.js
$fsx.f[62] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const reducers_1 = $fsx.r(63);
const isRawInstapyMethod = rawInstapyLine => rawInstapyLine.startsWith('    def');
const toOneLineMethod = reducers_1.mergeWithLastWhen('(', '):', '', isRawInstapyMethod);
const isNConsecutiveTimes = (char, arr, index = 0) => {
    const rec = n => n < 0 ? true : index + 1 - n <= 0 ? false : arr[index - n] !== char ? false : rec(n - 1);
    return rec;
};
const maxConsecutive = (checkString, n = 1) => (acc, curr, index, arr) => {
    return isNConsecutiveTimes(checkString, arr, index)(1) ? acc : [
        ...acc,
        curr
    ];
};
const trimExcessWhiteSpace = str => str.split('').reduce(maxConsecutive(' '), []).join('');
const isString = val => rambda_1.type(val) === 'String';
const dropDef = str => rambda_1.pipe(rambda_1.split(''), rambda_1.drop(5), rambda_1.join(''))(str);
exports.trimExcessData = rawInstapy => rambda_1.pipe(rambda_1.split('\n'), rambda_1.reduce(toOneLineMethod, []), rambda_1.filter(isString), rambda_1.filter(isRawInstapyMethod), rambda_1.map(trimExcessWhiteSpace), rambda_1.map(dropDef))(rawInstapy);
}
// default/src/gen/reducers.js
$fsx.f[63] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
exports.mergeWithLastWhen = (has, ends, joinWith, checkLastFn = last => true) => (acc, curr) => acc.length > 0 && checkLastFn(acc[acc.length - 1]) && acc[acc.length - 1].includes(has) && rambda_1.not(acc[acc.length - 1].endsWith(ends)) ? [
    ...rambda_1.dropLast(1, acc),
    `${ acc[acc.length - 1] }${ joinWith }${ curr }`
] : [
    ...acc,
    curr
];
}
// default/src/gen/extract.js
$fsx.f[64] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const reducers_1 = $fsx.r(63);
const types_1 = $fsx.r(5);
const log = val => {
    console.log(val);
    return val;
};
const dropMethodName = rambda_1.pipe(rambda_1.split('('), rambda_1.drop(1), rambda_1.join('('));
const trimArgs = rambda_1.pipe(rambda_1.split(''), rambda_1.reverse, rambda_1.drop(2), rambda_1.reverse, rambda_1.join(''));
const extractArgName = arg => rambda_1.includes('=', arg) ? rambda_1.pipe(rambda_1.split('='), rambda_1.take(1), rambda_1.join(''))(arg) : arg;
const argDefault = arg => rambda_1.includes('=', arg) ? rambda_1.pipe(rambda_1.split('='), rambda_1.reverse, rambda_1.take(1), rambda_1.join(''))(arg) : 'None';
const extractArg = arg => ({
    _name: extractArgName(arg),
    _default: argDefault(arg)
});
const formatArg = rambda_1.pipe(rambda_1.reject(rambda_1.equals('self')), rambda_1.reject(rambda_1.equals('**kwargs')), rambda_1.map(extractArg));
const extractMethodArgs = methodLine => rambda_1.pipe(dropMethodName, trimArgs, rambda_1.split(', '), rambda_1.reduce(reducers_1.mergeWithLastWhen('=(', ')', ', '), []), formatArg)(methodLine);
const isNone = def => def === 'None';
const isBoolean = def => def === 'True' || def === 'False';
const isString = def => def.startsWith(`"`) && def.endsWith(`"`);
const isNumber = def => !isNaN(def);
const isArray = def => def.startsWith('[') && def.endsWith(']');
const isTuple = def => def.startsWith('(') && def.endsWith(')');
const extractType = def => isNone(def) ? types_1.createType.none() : isBoolean(def) ? types_1.createType.boolean() : isString(def) ? types_1.createType.string() : isNumber(def) ? types_1.createType.number() : isArray(def) ? types_1.createType.array('String') : 'NAT';
const replaceDefaultType = ({_name, _default}) => ({
    _name: _name,
    _types: [extractType(_default)]
});
const concatTypes = (acc, curr) => {
    const index = rambda_1.findIndex(({_name}) => _name === curr._name, acc);
    return index === -1 ? [
        ...acc,
        curr
    ] : rambda_1.update(index, {
        _name: curr._name,
        _types: rambda_1.uniq([
            ...acc[index]._types,
            ...curr._types
        ])
    }, acc);
};
const extractArgs = methodLines => rambda_1.pipe(rambda_1.map(extractMethodArgs), rambda_1.flatten, rambda_1.map(replaceDefaultType), rambda_1.reduce(concatTypes, []))(methodLines);
const extractMethodName = methodLine => rambda_1.pipe(rambda_1.split('('), rambda_1.take(1), rambda_1.join(''))(methodLine);
const formatMethod = methodLine => ({
    _name: extractMethodName(methodLine),
    _args: extractMethodArgs(methodLine)
});
const isName = name => ({_name}) => _name === name;
const replaceNameMethod = fn => ({_name, _args}) => ({
    _name: fn(_name),
    _args
});
const isPythonString = val => val.startsWith(`"`) && val.endsWith(`"`) || val.startsWith(`'`) && val.endsWith(`'`);
const removeOuter1 = val => rambda_1.pipe(rambda_1.split(''), rambda_1.drop(1), rambda_1.reverse, rambda_1.drop(1), rambda_1.reverse, rambda_1.join(''))(val);
const toArray = str => rambda_1.pipe(removeOuter1, rambda_1.split(', '), rambda_1.reject(str => str === ''))(str);
const toTuple = str => rambda_1.pipe(removeOuter1, rambda_1.split(', '), rambda_1.map(pythonToJs))(str);
const pythonToJs = val => val === 'None' ? null : val === 'False' ? false : val === 'True' ? true : isPythonString(val) ? removeOuter1(val) : isNumber(val) ? Number(val) : isArray(val) ? toArray(val) : isTuple(val) ? toTuple(val) : val;
const defaultPyJs = ({_name, _default}) => ({
    _name,
    _default: pythonToJs(_default)
});
const methodArgDefaultPyJs = ({_name, _args}) => ({
    _name: _name,
    _args: rambda_1.map(defaultPyJs, _args)
});
const extractMethods = methodLines => rambda_1.pipe(rambda_1.map(formatMethod), rambda_1.reject(isName('like_by_feed')), rambda_1.map(replaceNameMethod(_name => _name === 'like_by_feed_generator' ? 'like_by_feed' : _name)), rambda_1.map(methodArgDefaultPyJs))(methodLines);
exports.extract = methodLines => ({
    args: extractArgs(methodLines),
    methods: extractMethods(methodLines)
});
}
// default/src/gen/suplement.js
$fsx.f[65] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const types_1 = $fsx.r(5);
const longPipe = (...pipeFns) => val => {
    const [pipeFnHead, ...pipeFnTail] = pipeFns.reverse();
    return pipeFnHead === undefined ? val : pipeFnHead(longPipe(...pipeFnTail.reverse())(val));
};
const replaceTypes = (name, types) => args => {
    const index = rambda_1.findIndex(({_name}) => _name === name, args);
    if (index === -1) {
        return args;
    } else {
        const updatedArgs = rambda_1.update(index, {
            _name: name,
            _types: types
        })(args);
        return updatedArgs;
    }
};
const concatTypes = (name, types) => args => {
    const index = rambda_1.findIndex(({_name}) => _name === name, args);
    if (index === -1) {
        return args;
    } else {
        const updatedArgs = rambda_1.update(index, {
            _name: name,
            _types: [
                ...args[index]._types,
                ...types
            ]
        })(args);
        return updatedArgs;
    }
};
const to1Type = arr => arr.length === 0 ? undefined : arr.length === 1 ? arr[0] : types_1.createType.union(arr);
const topLevelType = ({_name, _types}) => ({
    _name: _name,
    _type: to1Type(_types)
});
const stringTypes = longPipe(concatTypes('username', [types_1.createType.string()]), concatTypes('password', [types_1.createType.string()]), concatTypes('browser_profile_path', [types_1.createType.string()]), concatTypes('proxy_address', [types_1.createType.string()]), concatTypes('api_key', [types_1.createType.string()]), concatTypes('url', [types_1.createType.string()]), concatTypes('campaign', [types_1.createType.string()]), replaceTypes('selenium_url', [types_1.createType.string()]));
const arrayTypes = longPipe(concatTypes('comments', [types_1.createType.array('String')]), concatTypes('tags', [types_1.createType.array('String')]), concatTypes('users', [types_1.createType.array('String')]), concatTypes('words', [types_1.createType.array('String')]), concatTypes('friends', [types_1.createType.array('String')]), concatTypes('tags_skip', [types_1.createType.array('String')]), concatTypes('usernames', [types_1.createType.array('String')]), concatTypes('followlist', [types_1.createType.array('String')]), concatTypes('locations', [types_1.createType.array('String')]));
const unionTypes = rambda_1.pipe(concatTypes('media', [types_1.createType.union([
        'Photo',
        'Video'
    ])]), replaceTypes('sort', [types_1.createType.union([
        'top',
        'random'
    ])]), replaceTypes('style', [types_1.createType.union([
        'FIFO',
        'LIFO',
        'RANDOM'
    ])]), replaceTypes('compare_by', [types_1.createType.union([
        'latest',
        'earliest',
        'day',
        'month',
        'year'
    ])]), replaceTypes('compare_track', [types_1.createType.union([
        'first',
        'median',
        'last'
    ])]));
const booleanTypes = rambda_1.pipe(concatTypes('delimit_by_numbers', [types_1.createType.boolean()]));
const tupleTypes = rambda_1.pipe(replaceTypes('customList', [types_1.createType.tuple([
        types_1.createType.boolean(),
        types_1.createType.array('String'),
        types_1.createType.union([
            'all',
            'nonfollowers'
        ])
    ])]), replaceTypes('InstapyFollowed', [types_1.createType.tuple([
        types_1.createType.boolean(),
        types_1.createType.union([
            'all',
            'nonfollowers'
        ])
    ])]));
const numberTypes = longPipe(concatTypes('potency_ratio', [types_1.createType.number({
        step: 0.01,
        min: 0
    })]), concatTypes('unfollow_after', [types_1.createType.number({
        step: 1,
        min: 0
    })]), concatTypes('min', [types_1.createType.number({
        step: 1,
        min: 0
    })]), concatTypes('min_followers', [types_1.createType.number({
        step: 1,
        min: 0
    })]), concatTypes('min_following', [types_1.createType.number({
        step: 1,
        min: 0
    })]), concatTypes('max', [types_1.createType.number({
        step: 1,
        min: 1
    })]), concatTypes('max_followers', [types_1.createType.number({
        step: 1,
        min: 1
    })]), concatTypes('max_following', [types_1.createType.number({
        step: 1,
        min: 1
    })]), replaceTypes('page_delay', [types_1.createType.number({
        step: 1,
        min: 0
    })]), replaceTypes('daysold', [types_1.createType.number({
        step: 1,
        min: 0
    })]), replaceTypes('sleep_delay', [types_1.createType.number({
        step: 1,
        min: 0
    })]), replaceTypes('follow_likers_per_photo', [types_1.createType.number({
        step: 1,
        min: 0
    })]), replaceTypes('times', [types_1.createType.number({
        step: 1,
        min: 1
    })]), replaceTypes('limit', [types_1.createType.number({
        step: 1,
        min: 1
    })]), replaceTypes('max_pic', [types_1.createType.number({
        step: 1,
        min: 1
    })]), replaceTypes('photos_grab_amount', [types_1.createType.number({
        step: 1,
        min: 1
    })]), replaceTypes('posts', [types_1.createType.number({
        step: 1,
        min: 1
    })]), concatTypes('proxy_port', [types_1.createType.number({
        step: 1,
        min: 1,
        max: 65535
    })]), replaceTypes('percentage', [
    types_1.createType.number({
        step: 1,
        min: 0,
        max: 100
    }),
    types_1.createType.none()
]), replaceTypes('amount', [
    types_1.createType.number({
        step: 1,
        min: 1
    }),
    types_1.createType.none()
]));
const suplementTypes = longPipe(stringTypes, arrayTypes, unionTypes, booleanTypes, numberTypes, tupleTypes);
const suplementArgs = rambda_1.pipe(suplementTypes, rambda_1.map(topLevelType));
exports.suplement = ({methods, args}) => ({
    args: suplementArgs(args),
    methods: methods
});
}
// default/src/gen/format.js
$fsx.f[66] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const objReducer = (key, value) => (acc, curr) => ({
    ...acc,
    [curr[key]]: curr[value]
});
const toObject = (key, value) => arr => rambda_1.reduce(objReducer(key, value), {})(arr);
const toObjectArgs = toObject('_name', '_type');
const toObjectMethods = toObject('_name', '_args');
const toObjectMethodArgs = toObject('_name', '_default');
const formatArgs = toObjectArgs;
const formatMethods = methods => {
    const methodObj = toObjectMethods(methods);
    const methodArgObj = rambda_1.map(toObjectMethodArgs, methodObj);
    return methodArgObj;
};
exports.format = ({args, methods}) => ({
    args: formatArgs(args),
    methods: formatMethods(methods)
});
}
// default/src/controls/index.js
$fsx.f[67] = function(module,exports){
var __dirname = "src/controls";
Object.defineProperty(exports, '__esModule', { value: true });
const status_1 = $fsx.r(68);
const start_1 = $fsx.r(70);
const stop_1 = $fsx.r(71);
const logs_1 = $fsx.r(72);
const defaultInstapyPath = `${ __dirname }/../../InstaPy`;
exports.controls = (projectPath = defaultInstapyPath) => ({
    start: () => start_1.start(projectPath),
    stop: () => stop_1.stop(projectPath),
    logs: () => logs_1.logs(projectPath),
    status: () => status_1.prettyBotStatus(projectPath)
});
}
// default/src/controls/status.js
$fsx.f[68] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = $fsx.r(69);
const countIncludesReducer = containString => (acc, curr) => curr.includes(containString) ? acc + 1 : acc;
const convertToBotCodes = (ups, exits) => ups + '' + exits;
const isFirstReducer = check => (acc, curr) => curr[0] === check ? curr[1] : acc;
const toBotStatus = stdout => {
    const stdoutArr = stdout.split('\n');
    console.log(stdoutArr);
    const totalUp = stdoutArr.reduce(countIncludesReducer('Up'), 0);
    const totalExit = stdoutArr.reduce(countIncludesReducer('Exit'), 0);
    return convertToBotCodes(totalUp, totalExit);
};
const toPrettyBotStatus = botStatus => [
    [
        '00',
        'Not Initalised'
    ],
    [
        '11',
        'Done'
    ],
    [
        '20',
        'Running'
    ],
    [
        '02',
        'Stopped'
    ]
].reduce(isFirstReducer(botStatus), '');
exports.botStatus = projectPath => utils_1.composeExec(projectPath)('ps').then(toBotStatus);
exports.prettyBotStatus = projectPath => exports.botStatus(projectPath).then(toPrettyBotStatus);
}
// default/src/controls/utils.js
$fsx.f[69] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = $fsx.r(97);
const dockerCompose = (projectPath, ...args) => [
    `docker-compose --file ${ projectPath }/docker-prod.yml`,
    ...args
].join(' ');
const wrappedExec = command => new Promise((res, rej) => child_process_1.exec(command, (error, stdout, stderr) => error ? rej(error) : res(stdout || stderr)));
exports.composeExec = projectPath => (...args) => wrappedExec(dockerCompose(projectPath, ...args));
}
// default/src/controls/start.js
$fsx.f[70] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = $fsx.r(69);
exports.start = projectPath => utils_1.composeExec(projectPath)('up', '-d', '--build').then(() => 'succes');
}
// default/src/controls/stop.js
$fsx.f[71] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = $fsx.r(69);
exports.stop = projectPath => utils_1.composeExec(projectPath)('stop').then(() => 'succes');
}
// default/src/controls/logs.js
$fsx.f[72] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const rambda_1 = $fsx.r(117);
const utils_1 = $fsx.r(69);
exports.logs = projectPath => utils_1.composeExec(projectPath)('logs', 'web').then(rambda_1.split('\n')).then(rambda_1.takeLast(30));
}
// default/docSrc/src/components/config-out/types.js
$fsx.f[73] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// @cycle/dom/lib/cjs/index.js
$fsx.f[74] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var thunk_1 = $fsx.r(75);
exports.thunk = thunk_1.thunk;
var MainDOMSource_1 = $fsx.r(76);
exports.MainDOMSource = MainDOMSource_1.MainDOMSource;
var makeDOMDriver_1 = $fsx.r(84);
exports.makeDOMDriver = makeDOMDriver_1.makeDOMDriver;
var mockDOMSource_1 = $fsx.r(92);
exports.mockDOMSource = mockDOMSource_1.mockDOMSource;
exports.MockedDOMSource = mockDOMSource_1.MockedDOMSource;
var h_1 = $fsx.r(125);
exports.h = h_1.h;
var hyperscript_helpers_1 = $fsx.r(93);
exports.svg = hyperscript_helpers_1.default.svg;
exports.a = hyperscript_helpers_1.default.a;
exports.abbr = hyperscript_helpers_1.default.abbr;
exports.address = hyperscript_helpers_1.default.address;
exports.area = hyperscript_helpers_1.default.area;
exports.article = hyperscript_helpers_1.default.article;
exports.aside = hyperscript_helpers_1.default.aside;
exports.audio = hyperscript_helpers_1.default.audio;
exports.b = hyperscript_helpers_1.default.b;
exports.base = hyperscript_helpers_1.default.base;
exports.bdi = hyperscript_helpers_1.default.bdi;
exports.bdo = hyperscript_helpers_1.default.bdo;
exports.blockquote = hyperscript_helpers_1.default.blockquote;
exports.body = hyperscript_helpers_1.default.body;
exports.br = hyperscript_helpers_1.default.br;
exports.button = hyperscript_helpers_1.default.button;
exports.canvas = hyperscript_helpers_1.default.canvas;
exports.caption = hyperscript_helpers_1.default.caption;
exports.cite = hyperscript_helpers_1.default.cite;
exports.code = hyperscript_helpers_1.default.code;
exports.col = hyperscript_helpers_1.default.col;
exports.colgroup = hyperscript_helpers_1.default.colgroup;
exports.dd = hyperscript_helpers_1.default.dd;
exports.del = hyperscript_helpers_1.default.del;
exports.dfn = hyperscript_helpers_1.default.dfn;
exports.dir = hyperscript_helpers_1.default.dir;
exports.div = hyperscript_helpers_1.default.div;
exports.dl = hyperscript_helpers_1.default.dl;
exports.dt = hyperscript_helpers_1.default.dt;
exports.em = hyperscript_helpers_1.default.em;
exports.embed = hyperscript_helpers_1.default.embed;
exports.fieldset = hyperscript_helpers_1.default.fieldset;
exports.figcaption = hyperscript_helpers_1.default.figcaption;
exports.figure = hyperscript_helpers_1.default.figure;
exports.footer = hyperscript_helpers_1.default.footer;
exports.form = hyperscript_helpers_1.default.form;
exports.h1 = hyperscript_helpers_1.default.h1;
exports.h2 = hyperscript_helpers_1.default.h2;
exports.h3 = hyperscript_helpers_1.default.h3;
exports.h4 = hyperscript_helpers_1.default.h4;
exports.h5 = hyperscript_helpers_1.default.h5;
exports.h6 = hyperscript_helpers_1.default.h6;
exports.head = hyperscript_helpers_1.default.head;
exports.header = hyperscript_helpers_1.default.header;
exports.hgroup = hyperscript_helpers_1.default.hgroup;
exports.hr = hyperscript_helpers_1.default.hr;
exports.html = hyperscript_helpers_1.default.html;
exports.i = hyperscript_helpers_1.default.i;
exports.iframe = hyperscript_helpers_1.default.iframe;
exports.img = hyperscript_helpers_1.default.img;
exports.input = hyperscript_helpers_1.default.input;
exports.ins = hyperscript_helpers_1.default.ins;
exports.kbd = hyperscript_helpers_1.default.kbd;
exports.keygen = hyperscript_helpers_1.default.keygen;
exports.label = hyperscript_helpers_1.default.label;
exports.legend = hyperscript_helpers_1.default.legend;
exports.li = hyperscript_helpers_1.default.li;
exports.link = hyperscript_helpers_1.default.link;
exports.main = hyperscript_helpers_1.default.main;
exports.map = hyperscript_helpers_1.default.map;
exports.mark = hyperscript_helpers_1.default.mark;
exports.menu = hyperscript_helpers_1.default.menu;
exports.meta = hyperscript_helpers_1.default.meta;
exports.nav = hyperscript_helpers_1.default.nav;
exports.noscript = hyperscript_helpers_1.default.noscript;
exports.object = hyperscript_helpers_1.default.object;
exports.ol = hyperscript_helpers_1.default.ol;
exports.optgroup = hyperscript_helpers_1.default.optgroup;
exports.option = hyperscript_helpers_1.default.option;
exports.p = hyperscript_helpers_1.default.p;
exports.param = hyperscript_helpers_1.default.param;
exports.pre = hyperscript_helpers_1.default.pre;
exports.progress = hyperscript_helpers_1.default.progress;
exports.q = hyperscript_helpers_1.default.q;
exports.rp = hyperscript_helpers_1.default.rp;
exports.rt = hyperscript_helpers_1.default.rt;
exports.ruby = hyperscript_helpers_1.default.ruby;
exports.s = hyperscript_helpers_1.default.s;
exports.samp = hyperscript_helpers_1.default.samp;
exports.script = hyperscript_helpers_1.default.script;
exports.section = hyperscript_helpers_1.default.section;
exports.select = hyperscript_helpers_1.default.select;
exports.small = hyperscript_helpers_1.default.small;
exports.source = hyperscript_helpers_1.default.source;
exports.span = hyperscript_helpers_1.default.span;
exports.strong = hyperscript_helpers_1.default.strong;
exports.style = hyperscript_helpers_1.default.style;
exports.sub = hyperscript_helpers_1.default.sub;
exports.sup = hyperscript_helpers_1.default.sup;
exports.table = hyperscript_helpers_1.default.table;
exports.tbody = hyperscript_helpers_1.default.tbody;
exports.td = hyperscript_helpers_1.default.td;
exports.textarea = hyperscript_helpers_1.default.textarea;
exports.tfoot = hyperscript_helpers_1.default.tfoot;
exports.th = hyperscript_helpers_1.default.th;
exports.thead = hyperscript_helpers_1.default.thead;
exports.title = hyperscript_helpers_1.default.title;
exports.tr = hyperscript_helpers_1.default.tr;
exports.u = hyperscript_helpers_1.default.u;
exports.ul = hyperscript_helpers_1.default.ul;
exports.video = hyperscript_helpers_1.default.video;
}
// @cycle/dom/lib/cjs/thunk.js
$fsx.f[75] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var h_1 = $fsx.r(125);
function copyToThunk(vnode, thunkVNode) {
    thunkVNode.elm = vnode.elm;
    vnode.data.fn = thunkVNode.data.fn;
    vnode.data.args = thunkVNode.data.args;
    vnode.data.isolate = thunkVNode.data.isolate;
    thunkVNode.data = vnode.data;
    thunkVNode.children = vnode.children;
    thunkVNode.text = vnode.text;
    thunkVNode.elm = vnode.elm;
}
function init(thunkVNode) {
    var cur = thunkVNode.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunkVNode);
}
function prepatch(oldVnode, thunkVNode) {
    var old = oldVnode.data, cur = thunkVNode.data;
    var i;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunkVNode);
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunkVNode);
            return;
        }
    }
    copyToThunk(oldVnode, thunkVNode);
}
function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: {
            init: init,
            prepatch: prepatch
        },
        fn: fn,
        args: args
    });
}
exports.thunk = thunk;
exports.default = thunk;
}
// @cycle/dom/lib/cjs/MainDOMSource.js
$fsx.f[76] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var adapt_1 = $fsx.r(95);
var DocumentDOMSource_1 = $fsx.r(77);
var BodyDOMSource_1 = $fsx.r(79);
var ElementFinder_1 = $fsx.r(80);
var isolate_1 = $fsx.r(83);
var MainDOMSource = function () {
    function MainDOMSource(_rootElement$, _sanitation$, _namespace, _isolateModule, _eventDelegator, _name) {
        if (_namespace === void 0) {
            _namespace = [];
        }
        this._rootElement$ = _rootElement$;
        this._sanitation$ = _sanitation$;
        this._namespace = _namespace;
        this._isolateModule = _isolateModule;
        this._eventDelegator = _eventDelegator;
        this._name = _name;
        this.isolateSource = function (source, scope) {
            return new MainDOMSource(source._rootElement$, source._sanitation$, source._namespace.concat(isolate_1.getScopeObj(scope)), source._isolateModule, source._eventDelegator, source._name);
        };
        this.isolateSink = isolate_1.makeIsolateSink(this._namespace);
    }
    MainDOMSource.prototype._elements = function () {
        if (this._namespace.length === 0) {
            return this._rootElement$.map(function (x) {
                return [x];
            });
        } else {
            var elementFinder_1 = new ElementFinder_1.ElementFinder(this._namespace, this._isolateModule);
            return this._rootElement$.map(function () {
                return elementFinder_1.call();
            });
        }
    };
    MainDOMSource.prototype.elements = function () {
        var out = adapt_1.adapt(this._elements().remember());
        out._isCycleSource = this._name;
        return out;
    };
    MainDOMSource.prototype.element = function () {
        var out = adapt_1.adapt(this._elements().filter(function (arr) {
            return arr.length > 0;
        }).map(function (arr) {
            return arr[0];
        }).remember());
        out._isCycleSource = this._name;
        return out;
    };
    Object.defineProperty(MainDOMSource.prototype, 'namespace', {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    MainDOMSource.prototype.select = function (selector) {
        if (typeof selector !== 'string') {
            throw new Error('DOM driver\'s select() expects the argument to be a ' + 'string as a CSS selector');
        }
        if (selector === 'document') {
            return new DocumentDOMSource_1.DocumentDOMSource(this._name);
        }
        if (selector === 'body') {
            return new BodyDOMSource_1.BodyDOMSource(this._name);
        }
        var namespace = selector === ':root' ? [] : this._namespace.concat({
            type: 'selector',
            scope: selector.trim()
        });
        return new MainDOMSource(this._rootElement$, this._sanitation$, namespace, this._isolateModule, this._eventDelegator, this._name);
    };
    MainDOMSource.prototype.events = function (eventType, options, bubbles) {
        if (options === void 0) {
            options = {};
        }
        if (typeof eventType !== 'string') {
            throw new Error('DOM driver\'s events() expects argument to be a ' + 'string representing the event type to listen for.');
        }
        var event$ = this._eventDelegator.addEventListener(eventType, this._namespace, options, bubbles);
        var out = adapt_1.adapt(event$);
        out._isCycleSource = this._name;
        return out;
    };
    MainDOMSource.prototype.dispose = function () {
        this._sanitation$.shamefullySendNext(null);
    };
    return MainDOMSource;
}();
exports.MainDOMSource = MainDOMSource;
}
// @cycle/dom/lib/cjs/DocumentDOMSource.js
$fsx.f[77] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
var fromEvent_1 = $fsx.r(78);
var DocumentDOMSource = function () {
    function DocumentDOMSource(_name) {
        this._name = _name;
    }
    DocumentDOMSource.prototype.select = function (selector) {
        return this;
    };
    DocumentDOMSource.prototype.elements = function () {
        var out = adapt_1.adapt(xstream_1.default.of([document]));
        out._isCycleSource = this._name;
        return out;
    };
    DocumentDOMSource.prototype.element = function () {
        var out = adapt_1.adapt(xstream_1.default.of(document));
        out._isCycleSource = this._name;
        return out;
    };
    DocumentDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) {
            options = {};
        }
        var stream;
        stream = fromEvent_1.fromEvent(document, eventType, options.useCapture, options.preventDefault);
        var out = adapt_1.adapt(stream);
        out._isCycleSource = this._name;
        return out;
    };
    return DocumentDOMSource;
}();
exports.DocumentDOMSource = DocumentDOMSource;
}
// @cycle/dom/lib/cjs/fromEvent.js
$fsx.f[78] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
function fromEvent(element, eventName, useCapture, preventDefault, passive) {
    if (useCapture === void 0) {
        useCapture = false;
    }
    if (preventDefault === void 0) {
        preventDefault = false;
    }
    if (passive === void 0) {
        passive = false;
    }
    return xstream_1.Stream.create({
        element: element,
        next: null,
        start: function start(listener) {
            if (preventDefault) {
                this.next = function next(event) {
                    preventDefaultConditional(event, preventDefault);
                    listener.next(event);
                };
            } else {
                this.next = function next(event) {
                    listener.next(event);
                };
            }
            this.element.addEventListener(eventName, this.next, {
                capture: useCapture,
                passive: passive
            });
        },
        stop: function stop() {
            this.element.removeEventListener(eventName, this.next, useCapture);
        }
    });
}
exports.fromEvent = fromEvent;
function matchObject(matcher, obj) {
    var keys = Object.keys(matcher);
    var n = keys.length;
    for (var i = 0; i < n; i++) {
        var k = keys[i];
        if (typeof matcher[k] === 'object' && typeof obj[k] === 'object') {
            if (!matchObject(matcher[k], obj[k])) {
                return false;
            }
        } else if (matcher[k] !== obj[k]) {
            return false;
        }
    }
    return true;
}
function preventDefaultConditional(event, preventDefault) {
    if (preventDefault) {
        if (typeof preventDefault === 'boolean') {
            event.preventDefault();
        } else if (typeof preventDefault === 'function') {
            if (preventDefault(event)) {
                event.preventDefault();
            }
        } else if (typeof preventDefault === 'object') {
            if (matchObject(preventDefault, event)) {
                event.preventDefault();
            }
        } else {
            throw new Error('preventDefault has to be either a boolean, predicate function or object');
        }
    }
}
exports.preventDefaultConditional = preventDefaultConditional;
}
// @cycle/dom/lib/cjs/BodyDOMSource.js
$fsx.f[79] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
var fromEvent_1 = $fsx.r(78);
var BodyDOMSource = function () {
    function BodyDOMSource(_name) {
        this._name = _name;
    }
    BodyDOMSource.prototype.select = function (selector) {
        return this;
    };
    BodyDOMSource.prototype.elements = function () {
        var out = adapt_1.adapt(xstream_1.default.of([document.body]));
        out._isCycleSource = this._name;
        return out;
    };
    BodyDOMSource.prototype.element = function () {
        var out = adapt_1.adapt(xstream_1.default.of(document.body));
        out._isCycleSource = this._name;
        return out;
    };
    BodyDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) {
            options = {};
        }
        var stream;
        stream = fromEvent_1.fromEvent(document.body, eventType, options.useCapture, options.preventDefault);
        var out = adapt_1.adapt(stream);
        out._isCycleSource = this._name;
        return out;
    };
    return BodyDOMSource;
}();
exports.BodyDOMSource = BodyDOMSource;
}
// @cycle/dom/lib/cjs/ElementFinder.js
$fsx.f[80] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var ScopeChecker_1 = $fsx.r(81);
var utils_1 = $fsx.r(82);
function toElArray(input) {
    return Array.prototype.slice.call(input);
}
var ElementFinder = function () {
    function ElementFinder(namespace, isolateModule) {
        this.namespace = namespace;
        this.isolateModule = isolateModule;
    }
    ElementFinder.prototype.call = function () {
        var namespace = this.namespace;
        var selector = utils_1.getSelectors(namespace);
        var scopeChecker = new ScopeChecker_1.ScopeChecker(namespace, this.isolateModule);
        var topNode = this.isolateModule.getElement(namespace.filter(function (n) {
            return n.type !== 'selector';
        }));
        if (topNode === undefined) {
            return [];
        }
        if (selector === '') {
            return [topNode];
        }
        return toElArray(topNode.querySelectorAll(selector)).filter(scopeChecker.isDirectlyInScope, scopeChecker).concat(topNode.matches(selector) ? [topNode] : []);
    };
    return ElementFinder;
}();
exports.ElementFinder = ElementFinder;
}
// @cycle/dom/lib/cjs/ScopeChecker.js
$fsx.f[81] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = $fsx.r(82);
var ScopeChecker = function () {
    function ScopeChecker(namespace, isolateModule) {
        this.namespace = namespace;
        this.isolateModule = isolateModule;
        this._namespace = namespace.filter(function (n) {
            return n.type !== 'selector';
        });
    }
    ScopeChecker.prototype.isDirectlyInScope = function (leaf) {
        var namespace = this.isolateModule.getNamespace(leaf);
        if (!namespace) {
            return false;
        }
        if (this._namespace.length > namespace.length || !utils_1.isEqualNamespace(this._namespace, namespace.slice(0, this._namespace.length))) {
            return false;
        }
        for (var i = this._namespace.length; i < namespace.length; i++) {
            if (namespace[i].type === 'total') {
                return false;
            }
        }
        return true;
    };
    return ScopeChecker;
}();
exports.ScopeChecker = ScopeChecker;
}
// @cycle/dom/lib/cjs/utils.js
$fsx.f[82] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function isValidNode(obj) {
    var ELEM_TYPE = 1;
    var FRAG_TYPE = 11;
    return typeof HTMLElement === 'object' ? obj instanceof HTMLElement || obj instanceof DocumentFragment : obj && typeof obj === 'object' && obj !== null && (obj.nodeType === ELEM_TYPE || obj.nodeType === FRAG_TYPE) && typeof obj.nodeName === 'string';
}
function isClassOrId(str) {
    return str.length > 1 && (str[0] === '.' || str[0] === '#');
}
exports.isClassOrId = isClassOrId;
function isDocFrag(el) {
    return el.nodeType === 11;
}
exports.isDocFrag = isDocFrag;
function checkValidContainer(container) {
    if (typeof container !== 'string' && !isValidNode(container)) {
        throw new Error('Given container is not a DOM element neither a selector string.');
    }
}
exports.checkValidContainer = checkValidContainer;
function getValidNode(selectors) {
    var domElement = typeof selectors === 'string' ? document.querySelector(selectors) : selectors;
    if (typeof selectors === 'string' && domElement === null) {
        throw new Error('Cannot render into unknown element `' + selectors + '`');
    }
    return domElement;
}
exports.getValidNode = getValidNode;
function getSelectors(namespace) {
    var res = '';
    for (var i = namespace.length - 1; i >= 0; i--) {
        if (namespace[i].type !== 'selector') {
            break;
        }
        res = namespace[i].scope + ' ' + res;
    }
    return res.trim();
}
exports.getSelectors = getSelectors;
function isEqualNamespace(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i].type !== b[i].type || a[i].scope !== b[i].scope) {
            return false;
        }
    }
    return true;
}
exports.isEqualNamespace = isEqualNamespace;
function makeInsert(map) {
    return function (type, elm, value) {
        if (map.has(type)) {
            var innerMap = map.get(type);
            innerMap.set(elm, value);
        } else {
            var innerMap = new Map();
            innerMap.set(elm, value);
            map.set(type, innerMap);
        }
    };
}
exports.makeInsert = makeInsert;
}
// @cycle/dom/lib/cjs/isolate.js
$fsx.f[83] = function(module,exports){
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = $fsx.r(82);
function makeIsolateSink(namespace) {
    return function (sink, scope) {
        if (scope === ':root') {
            return sink;
        }
        return sink.map(function (node) {
            if (!node) {
                return node;
            }
            var scopeObj = getScopeObj(scope);
            var newNode = __assign({}, node, { data: __assign({}, node.data, { isolate: !node.data || !Array.isArray(node.data.isolate) ? namespace.concat([scopeObj]) : node.data.isolate }) });
            return __assign({}, newNode, { key: newNode.key !== undefined ? newNode.key : JSON.stringify(newNode.data.isolate) });
        });
    };
}
exports.makeIsolateSink = makeIsolateSink;
function getScopeObj(scope) {
    return {
        type: utils_1.isClassOrId(scope) ? 'sibling' : 'total',
        scope: scope
    };
}
exports.getScopeObj = getScopeObj;
}
// @cycle/dom/lib/cjs/makeDOMDriver.js
$fsx.f[84] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var snabbdom_1 = $fsx.r(128);
var xstream_1 = $fsx.r(148);
var concat_1 = $fsx.r(149);
var sampleCombine_1 = $fsx.r(150);
var MainDOMSource_1 = $fsx.r(76);
var tovnode_1 = $fsx.r(131);
var VNodeWrapper_1 = $fsx.r(85);
var utils_1 = $fsx.r(82);
var modules_1 = $fsx.r(86);
var IsolateModule_1 = $fsx.r(87);
var EventDelegator_1 = $fsx.r(89);
function makeDOMDriverInputGuard(modules) {
    if (!Array.isArray(modules)) {
        throw new Error('Optional modules option must be an array for snabbdom modules');
    }
}
function domDriverInputGuard(view$) {
    if (!view$ || typeof view$.addListener !== 'function' || typeof view$.fold !== 'function') {
        throw new Error('The DOM driver function expects as input a Stream of ' + 'virtual DOM elements');
    }
}
function dropCompletion(input) {
    return xstream_1.default.merge(input, xstream_1.default.never());
}
function unwrapElementFromVNode(vnode) {
    return vnode.elm;
}
function reportSnabbdomError(err) {
    (console.error || console.log)(err);
}
function makeDOMReady$() {
    return xstream_1.default.create({
        start: function (lis) {
            if (document.readyState === 'loading') {
                document.addEventListener('readystatechange', function () {
                    var state = document.readyState;
                    if (state === 'interactive' || state === 'complete') {
                        lis.next(null);
                        lis.complete();
                    }
                });
            } else {
                lis.next(null);
                lis.complete();
            }
        },
        stop: function () {
        }
    });
}
function addRootScope(vnode) {
    vnode.data = vnode.data || {};
    vnode.data.isolate = [];
    return vnode;
}
function makeDOMDriver(container, options) {
    if (!options) {
        options = {};
    }
    utils_1.checkValidContainer(container);
    var modules = options.modules || modules_1.default;
    makeDOMDriverInputGuard(modules);
    var isolateModule = new IsolateModule_1.IsolateModule();
    var patch = snabbdom_1.init([isolateModule.createModule()].concat(modules));
    var domReady$ = makeDOMReady$();
    var vnodeWrapper;
    var mutationObserver;
    var mutationConfirmed$ = xstream_1.default.create({
        start: function (listener) {
            mutationObserver = new MutationObserver(function () {
                return listener.next(null);
            });
        },
        stop: function () {
            mutationObserver.disconnect();
        }
    });
    function DOMDriver(vnode$, name) {
        if (name === void 0) {
            name = 'DOM';
        }
        domDriverInputGuard(vnode$);
        var sanitation$ = xstream_1.default.create();
        var firstRoot$ = domReady$.map(function () {
            var firstRoot = utils_1.getValidNode(container) || document.body;
            vnodeWrapper = new VNodeWrapper_1.VNodeWrapper(firstRoot);
            return firstRoot;
        });
        var rememberedVNode$ = vnode$.remember();
        rememberedVNode$.addListener({});
        mutationConfirmed$.addListener({});
        var elementAfterPatch$ = firstRoot$.map(function (firstRoot) {
            return xstream_1.default.merge(rememberedVNode$.endWhen(sanitation$), sanitation$).map(function (vnode) {
                return vnodeWrapper.call(vnode);
            }).startWith(addRootScope(tovnode_1.toVNode(firstRoot))).fold(patch, tovnode_1.toVNode(firstRoot)).drop(1).map(unwrapElementFromVNode).startWith(firstRoot).map(function (el) {
                mutationObserver.observe(el, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true,
                    attributeOldValue: true,
                    characterDataOldValue: true
                });
                return el;
            }).compose(dropCompletion);
        }).flatten();
        var rootElement$ = concat_1.default(domReady$, mutationConfirmed$).endWhen(sanitation$).compose(sampleCombine_1.default(elementAfterPatch$)).map(function (arr) {
            return arr[1];
        }).remember();
        rootElement$.addListener({ error: reportSnabbdomError });
        var delegator = new EventDelegator_1.EventDelegator(rootElement$, isolateModule);
        return new MainDOMSource_1.MainDOMSource(rootElement$, sanitation$, [], isolateModule, delegator, name);
    }
    return DOMDriver;
}
exports.makeDOMDriver = makeDOMDriver;
}
// @cycle/dom/lib/cjs/VNodeWrapper.js
$fsx.f[85] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var vnode_1 = $fsx.r(126);
var h_1 = $fsx.r(125);
var snabbdom_selector_1 = $fsx.r(118);
var utils_1 = $fsx.r(82);
var VNodeWrapper = function () {
    function VNodeWrapper(rootElement) {
        this.rootElement = rootElement;
    }
    VNodeWrapper.prototype.call = function (vnode) {
        if (utils_1.isDocFrag(this.rootElement)) {
            return this.wrapDocFrag(vnode === null ? [] : [vnode]);
        }
        if (vnode === null) {
            return this.wrap([]);
        }
        var _a = snabbdom_selector_1.selectorParser(vnode), selTagName = _a.tagName, selId = _a.id;
        var vNodeClassName = snabbdom_selector_1.classNameFromVNode(vnode);
        var vNodeData = vnode.data || {};
        var vNodeDataProps = vNodeData.props || {};
        var _b = vNodeDataProps.id, vNodeId = _b === void 0 ? selId : _b;
        var isVNodeAndRootElementIdentical = typeof vNodeId === 'string' && vNodeId.toUpperCase() === this.rootElement.id.toUpperCase() && selTagName.toUpperCase() === this.rootElement.tagName.toUpperCase() && vNodeClassName.toUpperCase() === this.rootElement.className.toUpperCase();
        if (isVNodeAndRootElementIdentical) {
            return vnode;
        }
        return this.wrap([vnode]);
    };
    VNodeWrapper.prototype.wrapDocFrag = function (children) {
        return vnode_1.vnode('', { isolate: [] }, children, undefined, this.rootElement);
    };
    VNodeWrapper.prototype.wrap = function (children) {
        var _a = this.rootElement, tagName = _a.tagName, id = _a.id, className = _a.className;
        var selId = id ? '#' + id : '';
        var selClass = className ? '.' + className.split(' ').join('.') : '';
        var vnode = h_1.h('' + tagName.toLowerCase() + selId + selClass, {}, children);
        vnode.data = vnode.data || {};
        vnode.data.isolate = vnode.data.isolate || [];
        return vnode;
    };
    return VNodeWrapper;
}();
exports.VNodeWrapper = VNodeWrapper;
}
// @cycle/dom/lib/cjs/modules.js
$fsx.f[86] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var class_1 = $fsx.r(132);
exports.ClassModule = class_1.default;
var props_1 = $fsx.r(133);
exports.PropsModule = props_1.default;
var attributes_1 = $fsx.r(134);
exports.AttrsModule = attributes_1.default;
var style_1 = $fsx.r(135);
exports.StyleModule = style_1.default;
var dataset_1 = $fsx.r(136);
exports.DatasetModule = dataset_1.default;
var modules = [
    style_1.default,
    class_1.default,
    props_1.default,
    attributes_1.default,
    dataset_1.default
];
exports.default = modules;
}
// @cycle/dom/lib/cjs/IsolateModule.js
$fsx.f[87] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = $fsx.r(82);
var SymbolTree_1 = $fsx.r(88);
var IsolateModule = function () {
    function IsolateModule() {
        this.namespaceTree = new SymbolTree_1.default(function (x) {
            return x.scope;
        });
        this.namespaceByElement = new Map();
        this.vnodesBeingRemoved = [];
    }
    IsolateModule.prototype.setEventDelegator = function (del) {
        this.eventDelegator = del;
    };
    IsolateModule.prototype.insertElement = function (namespace, el) {
        this.namespaceByElement.set(el, namespace);
        this.namespaceTree.set(namespace, el);
    };
    IsolateModule.prototype.removeElement = function (elm) {
        this.namespaceByElement.delete(elm);
        var namespace = this.getNamespace(elm);
        if (namespace) {
            this.namespaceTree.delete(namespace);
        }
    };
    IsolateModule.prototype.getElement = function (namespace, max) {
        return this.namespaceTree.get(namespace, undefined, max);
    };
    IsolateModule.prototype.getRootElement = function (elm) {
        if (this.namespaceByElement.has(elm)) {
            return elm;
        }
        var curr = elm;
        while (!this.namespaceByElement.has(curr)) {
            curr = curr.parentNode;
            if (!curr) {
                return undefined;
            } else if (curr.tagName === 'HTML') {
                throw new Error('No root element found, this should not happen at all');
            }
        }
        return curr;
    };
    IsolateModule.prototype.getNamespace = function (elm) {
        var rootElement = this.getRootElement(elm);
        if (!rootElement) {
            return undefined;
        }
        return this.namespaceByElement.get(rootElement);
    };
    IsolateModule.prototype.createModule = function () {
        var self = this;
        return {
            create: function (emptyVNode, vNode) {
                var elm = vNode.elm, _a = vNode.data, data = _a === void 0 ? {} : _a;
                var namespace = data.isolate;
                if (Array.isArray(namespace)) {
                    self.insertElement(namespace, elm);
                }
            },
            update: function (oldVNode, vNode) {
                var oldElm = oldVNode.elm, _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
                var oldNamespace = oldData.isolate;
                var namespace = data.isolate;
                if (!utils_1.isEqualNamespace(oldNamespace, namespace)) {
                    if (Array.isArray(oldNamespace)) {
                        self.removeElement(oldElm);
                    }
                }
                if (Array.isArray(namespace)) {
                    self.insertElement(namespace, elm);
                }
            },
            destroy: function (vNode) {
                self.vnodesBeingRemoved.push(vNode);
            },
            remove: function (vNode, cb) {
                self.vnodesBeingRemoved.push(vNode);
                cb();
            },
            post: function () {
                var vnodesBeingRemoved = self.vnodesBeingRemoved;
                for (var i = vnodesBeingRemoved.length - 1; i >= 0; i--) {
                    var vnode = vnodesBeingRemoved[i];
                    var namespace = vnode.data !== undefined ? vnode.data.isolation : undefined;
                    if (namespace !== undefined) {
                        self.removeElement(namespace);
                    }
                    self.eventDelegator.removeElement(vnode.elm, namespace);
                }
                self.vnodesBeingRemoved = [];
            }
        };
    };
    return IsolateModule;
}();
exports.IsolateModule = IsolateModule;
}
// @cycle/dom/lib/cjs/SymbolTree.js
$fsx.f[88] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var SymbolTree = function () {
    function SymbolTree(mapper) {
        this.mapper = mapper;
        this.tree = [
            undefined,
            {}
        ];
    }
    SymbolTree.prototype.set = function (path, element, max) {
        var curr = this.tree;
        var _max = max !== undefined ? max : path.length;
        for (var i = 0; i < _max; i++) {
            var n = this.mapper(path[i]);
            var child = curr[1][n];
            if (!child) {
                child = [
                    undefined,
                    {}
                ];
                curr[1][n] = child;
            }
            curr = child;
        }
        curr[0] = element;
    };
    SymbolTree.prototype.getDefault = function (path, mkDefaultElement, max) {
        return this.get(path, mkDefaultElement, max);
    };
    SymbolTree.prototype.get = function (path, mkDefaultElement, max) {
        var curr = this.tree;
        var _max = max !== undefined ? max : path.length;
        for (var i = 0; i < _max; i++) {
            var n = this.mapper(path[i]);
            var child = curr[1][n];
            if (!child) {
                if (mkDefaultElement) {
                    child = [
                        undefined,
                        {}
                    ];
                    curr[1][n] = child;
                } else {
                    return undefined;
                }
            }
            curr = child;
        }
        if (mkDefaultElement && !curr[0]) {
            curr[0] = mkDefaultElement();
        }
        return curr[0];
    };
    SymbolTree.prototype.delete = function (path) {
        var curr = this.tree;
        for (var i = 0; i < path.length - 1; i++) {
            var child = curr[1][this.mapper(path[i])];
            if (!child) {
                return;
            }
            curr = child;
        }
        delete curr[1][this.mapper(path[path.length - 1])];
    };
    return SymbolTree;
}();
exports.default = SymbolTree;
}
// @cycle/dom/lib/cjs/EventDelegator.js
$fsx.f[89] = function(module,exports){
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var ScopeChecker_1 = $fsx.r(81);
var utils_1 = $fsx.r(82);
var ElementFinder_1 = $fsx.r(80);
var SymbolTree_1 = $fsx.r(88);
var RemovalSet_1 = $fsx.r(90);
var PriorityQueue_1 = $fsx.r(91);
var fromEvent_1 = $fsx.r(78);
exports.eventTypesThatDontBubble = [
    'blur',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'focus',
    'load',
    'loadeddata',
    'loadedmetadata',
    'mouseenter',
    'mouseleave',
    'pause',
    'play',
    'playing',
    'ratechange',
    'reset',
    'scroll',
    'seeked',
    'seeking',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'unload',
    'volumechange',
    'waiting'
];
var EventDelegator = function () {
    function EventDelegator(rootElement$, isolateModule) {
        var _this = this;
        this.rootElement$ = rootElement$;
        this.isolateModule = isolateModule;
        this.virtualListeners = new SymbolTree_1.default(function (x) {
            return x.scope;
        });
        this.nonBubblingListenersToAdd = new RemovalSet_1.default();
        this.virtualNonBubblingListener = [];
        this.isolateModule.setEventDelegator(this);
        this.domListeners = new Map();
        this.domListenersToAdd = new Map();
        this.nonBubblingListeners = new Map();
        rootElement$.addListener({
            next: function (el) {
                if (_this.origin !== el) {
                    _this.origin = el;
                    _this.resetEventListeners();
                    _this.domListenersToAdd.forEach(function (passive, type) {
                        return _this.setupDOMListener(type, passive);
                    });
                    _this.domListenersToAdd.clear();
                }
                _this.resetNonBubblingListeners();
                _this.nonBubblingListenersToAdd.forEach(function (arr) {
                    _this.setupNonBubblingListener(arr);
                });
            }
        });
    }
    EventDelegator.prototype.addEventListener = function (eventType, namespace, options, bubbles) {
        var subject = xstream_1.default.never();
        var scopeChecker = new ScopeChecker_1.ScopeChecker(namespace, this.isolateModule);
        var dest = this.insertListener(subject, scopeChecker, eventType, options);
        var shouldBubble = bubbles === undefined ? exports.eventTypesThatDontBubble.indexOf(eventType) === -1 : bubbles;
        if (shouldBubble) {
            if (!this.domListeners.has(eventType)) {
                this.setupDOMListener(eventType, !!options.passive);
            }
        } else {
            var finder = new ElementFinder_1.ElementFinder(namespace, this.isolateModule);
            this.setupNonBubblingListener([
                eventType,
                finder,
                dest
            ]);
        }
        return subject;
    };
    EventDelegator.prototype.removeElement = function (element, namespace) {
        if (namespace !== undefined) {
            this.virtualListeners.delete(namespace);
        }
        var toRemove = [];
        this.nonBubblingListeners.forEach(function (map, type) {
            if (map.has(element)) {
                toRemove.push([
                    type,
                    element
                ]);
            }
        });
        for (var i = 0; i < toRemove.length; i++) {
            var map = this.nonBubblingListeners.get(toRemove[i][0]);
            if (!map) {
                continue;
            }
            map.delete(toRemove[i][1]);
            if (map.size === 0) {
                this.nonBubblingListeners.delete(toRemove[i][0]);
            } else {
                this.nonBubblingListeners.set(toRemove[i][0], map);
            }
        }
    };
    EventDelegator.prototype.insertListener = function (subject, scopeChecker, eventType, options) {
        var relevantSets = [];
        var n = scopeChecker._namespace;
        var max = n.length;
        do {
            relevantSets.push(this.getVirtualListeners(eventType, n, true, max));
            max--;
        } while (max >= 0 && n[max].type !== 'total');
        var destination = __assign({}, options, {
            scopeChecker: scopeChecker,
            subject: subject,
            bubbles: !!options.bubbles,
            useCapture: !!options.useCapture,
            passive: !!options.passive
        });
        for (var i = 0; i < relevantSets.length; i++) {
            relevantSets[i].add(destination, n.length);
        }
        return destination;
    };
    EventDelegator.prototype.getVirtualListeners = function (eventType, namespace, exact, max) {
        if (exact === void 0) {
            exact = false;
        }
        var _max = max !== undefined ? max : namespace.length;
        if (!exact) {
            for (var i = _max - 1; i >= 0; i--) {
                if (namespace[i].type === 'total') {
                    _max = i + 1;
                    break;
                }
                _max = i;
            }
        }
        var map = this.virtualListeners.getDefault(namespace, function () {
            return new Map();
        }, _max);
        if (!map.has(eventType)) {
            map.set(eventType, new PriorityQueue_1.default());
        }
        return map.get(eventType);
    };
    EventDelegator.prototype.setupDOMListener = function (eventType, passive) {
        var _this = this;
        if (this.origin) {
            var sub = fromEvent_1.fromEvent(this.origin, eventType, false, false, passive).subscribe({
                next: function (event) {
                    return _this.onEvent(eventType, event, passive);
                },
                error: function () {
                },
                complete: function () {
                }
            });
            this.domListeners.set(eventType, {
                sub: sub,
                passive: passive
            });
        } else {
            this.domListenersToAdd.set(eventType, passive);
        }
    };
    EventDelegator.prototype.setupNonBubblingListener = function (input) {
        var _this = this;
        var eventType = input[0], elementFinder = input[1], destination = input[2];
        if (!this.origin) {
            this.nonBubblingListenersToAdd.add(input);
            return;
        }
        var element = elementFinder.call()[0];
        if (element) {
            this.nonBubblingListenersToAdd.delete(input);
            var sub = fromEvent_1.fromEvent(element, eventType, false, false, destination.passive).subscribe({
                next: function (ev) {
                    return _this.onEvent(eventType, ev, !!destination.passive, false);
                },
                error: function () {
                },
                complete: function () {
                }
            });
            if (!this.nonBubblingListeners.has(eventType)) {
                this.nonBubblingListeners.set(eventType, new Map());
            }
            var map = this.nonBubblingListeners.get(eventType);
            if (!map) {
                return;
            }
            map.set(element, {
                sub: sub,
                destination: destination
            });
        } else {
            this.nonBubblingListenersToAdd.add(input);
        }
    };
    EventDelegator.prototype.resetEventListeners = function () {
        var iter = this.domListeners.entries();
        var curr = iter.next();
        while (!curr.done) {
            var _a = curr.value, type = _a[0], _b = _a[1], sub = _b.sub, passive = _b.passive;
            sub.unsubscribe();
            this.setupDOMListener(type, passive);
            curr = iter.next();
        }
    };
    EventDelegator.prototype.resetNonBubblingListeners = function () {
        var _this = this;
        var newMap = new Map();
        var insert = utils_1.makeInsert(newMap);
        this.nonBubblingListeners.forEach(function (map, type) {
            map.forEach(function (value, elm) {
                if (!document.body.contains(elm)) {
                    var sub = value.sub, destination_1 = value.destination;
                    if (sub) {
                        sub.unsubscribe();
                    }
                    var elementFinder = new ElementFinder_1.ElementFinder(destination_1.scopeChecker.namespace, _this.isolateModule);
                    var newElm = elementFinder.call()[0];
                    var newSub = fromEvent_1.fromEvent(newElm, type, false, false, destination_1.passive).subscribe({
                        next: function (event) {
                            return _this.onEvent(type, event, !!destination_1.passive, false);
                        },
                        error: function () {
                        },
                        complete: function () {
                        }
                    });
                    insert(type, newElm, {
                        sub: newSub,
                        destination: destination_1
                    });
                } else {
                    insert(type, elm, value);
                }
            });
            _this.nonBubblingListeners = newMap;
        });
    };
    EventDelegator.prototype.putNonBubblingListener = function (eventType, elm, useCapture, passive) {
        var map = this.nonBubblingListeners.get(eventType);
        if (!map) {
            return;
        }
        var listener = map.get(elm);
        if (listener && listener.destination.passive === passive && listener.destination.useCapture === useCapture) {
            this.virtualNonBubblingListener[0] = listener.destination;
        }
    };
    EventDelegator.prototype.onEvent = function (eventType, event, passive, bubbles) {
        if (bubbles === void 0) {
            bubbles = true;
        }
        var cycleEvent = this.patchEvent(event);
        var rootElement = this.isolateModule.getRootElement(event.target);
        if (bubbles) {
            var namespace = this.isolateModule.getNamespace(event.target);
            if (!namespace) {
                return;
            }
            var listeners = this.getVirtualListeners(eventType, namespace);
            this.bubble(eventType, event.target, rootElement, cycleEvent, listeners, namespace, namespace.length - 1, true, passive);
            this.bubble(eventType, event.target, rootElement, cycleEvent, listeners, namespace, namespace.length - 1, false, passive);
        } else {
            this.putNonBubblingListener(eventType, event.target, true, passive);
            this.doBubbleStep(eventType, event.target, rootElement, cycleEvent, this.virtualNonBubblingListener, true, passive);
            this.putNonBubblingListener(eventType, event.target, false, passive);
            this.doBubbleStep(eventType, event.target, rootElement, cycleEvent, this.virtualNonBubblingListener, false, passive);
            event.stopPropagation();
        }
    };
    EventDelegator.prototype.bubble = function (eventType, elm, rootElement, event, listeners, namespace, index, useCapture, passive) {
        if (!useCapture && !event.propagationHasBeenStopped) {
            this.doBubbleStep(eventType, elm, rootElement, event, listeners, useCapture, passive);
        }
        var newRoot = rootElement;
        var newIndex = index;
        if (elm === rootElement) {
            if (index >= 0 && namespace[index].type === 'sibling') {
                newRoot = this.isolateModule.getElement(namespace, index);
                newIndex--;
            } else {
                return;
            }
        }
        if (elm.parentNode && newRoot) {
            this.bubble(eventType, elm.parentNode, newRoot, event, listeners, namespace, newIndex, useCapture, passive);
        }
        if (useCapture && !event.propagationHasBeenStopped) {
            this.doBubbleStep(eventType, elm, rootElement, event, listeners, useCapture, passive);
        }
    };
    EventDelegator.prototype.doBubbleStep = function (eventType, elm, rootElement, event, listeners, useCapture, passive) {
        if (!rootElement) {
            return;
        }
        this.mutateEventCurrentTarget(event, elm);
        listeners.forEach(function (dest) {
            if (dest.passive === passive && dest.useCapture === useCapture) {
                var sel = utils_1.getSelectors(dest.scopeChecker.namespace);
                if (!event.propagationHasBeenStopped && dest.scopeChecker.isDirectlyInScope(elm) && (sel !== '' && elm.matches(sel) || sel === '' && elm === rootElement)) {
                    fromEvent_1.preventDefaultConditional(event, dest.preventDefault);
                    dest.subject.shamefullySendNext(event);
                }
            }
        });
    };
    EventDelegator.prototype.patchEvent = function (event) {
        var pEvent = event;
        pEvent.propagationHasBeenStopped = false;
        var oldStopPropagation = pEvent.stopPropagation;
        pEvent.stopPropagation = function stopPropagation() {
            oldStopPropagation.call(this);
            this.propagationHasBeenStopped = true;
        };
        return pEvent;
    };
    EventDelegator.prototype.mutateEventCurrentTarget = function (event, currentTargetElement) {
        try {
            Object.defineProperty(event, 'currentTarget', {
                value: currentTargetElement,
                configurable: true
            });
        } catch (err) {
            console.log('please use event.ownerTarget');
        }
        event.ownerTarget = currentTargetElement;
    };
    return EventDelegator;
}();
exports.EventDelegator = EventDelegator;
}
// @cycle/dom/lib/cjs/RemovalSet.js
$fsx.f[90] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var RemovalSet = function () {
    function RemovalSet() {
        this.toDelete = [];
        this.toDeleteSize = 0;
        this._set = new Set();
    }
    RemovalSet.prototype.add = function (t) {
        this._set.add(t);
    };
    RemovalSet.prototype.forEach = function (f) {
        this._set.forEach(f);
        this.flush();
    };
    RemovalSet.prototype.delete = function (t) {
        if (this.toDelete.length === this.toDeleteSize) {
            this.toDelete.push(t);
        } else {
            this.toDelete[this.toDeleteSize] = t;
        }
        this.toDeleteSize++;
    };
    RemovalSet.prototype.flush = function () {
        for (var i = 0; i < this.toDelete.length; i++) {
            if (i < this.toDeleteSize) {
                this._set.delete(this.toDelete[i]);
            }
            this.toDelete[i] = undefined;
        }
        this.toDeleteSize = 0;
    };
    return RemovalSet;
}();
exports.default = RemovalSet;
}
// @cycle/dom/lib/cjs/PriorityQueue.js
$fsx.f[91] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var PriorityQueue = function () {
    function PriorityQueue() {
        this.arr = [];
        this.prios = [];
    }
    PriorityQueue.prototype.add = function (t, prio) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.prios[i] < prio) {
                this.arr.splice(i, 0, t);
                this.prios.splice(i, 0, prio);
                return;
            }
        }
        this.arr.push(t);
        this.prios.push(prio);
    };
    PriorityQueue.prototype.forEach = function (f) {
        for (var i = 0; i < this.arr.length; i++) {
            f(this.arr[i], i, this.arr);
        }
    };
    PriorityQueue.prototype.delete = function (t) {
        for (var i = 0; i < this.arr.length; i++) {
            if (this.arr[i] === t) {
                this.arr.splice(i, 1);
                this.prios.splice(i, 1);
                return;
            }
        }
    };
    return PriorityQueue;
}();
exports.default = PriorityQueue;
}
// @cycle/dom/lib/cjs/mockDOMSource.js
$fsx.f[92] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
var SCOPE_PREFIX = '___';
var MockedDOMSource = function () {
    function MockedDOMSource(_mockConfig) {
        this._mockConfig = _mockConfig;
        if (_mockConfig.elements) {
            this._elements = _mockConfig.elements;
        } else {
            this._elements = adapt_1.adapt(xstream_1.default.empty());
        }
    }
    MockedDOMSource.prototype.elements = function () {
        var out = this._elements;
        out._isCycleSource = 'MockedDOM';
        return out;
    };
    MockedDOMSource.prototype.element = function () {
        var output$ = this.elements().filter(function (arr) {
            return arr.length > 0;
        }).map(function (arr) {
            return arr[0];
        }).remember();
        var out = adapt_1.adapt(output$);
        out._isCycleSource = 'MockedDOM';
        return out;
    };
    MockedDOMSource.prototype.events = function (eventType, options) {
        var streamForEventType = this._mockConfig[eventType];
        var out = adapt_1.adapt(streamForEventType || xstream_1.default.empty());
        out._isCycleSource = 'MockedDOM';
        return out;
    };
    MockedDOMSource.prototype.select = function (selector) {
        var mockConfigForSelector = this._mockConfig[selector] || {};
        return new MockedDOMSource(mockConfigForSelector);
    };
    MockedDOMSource.prototype.isolateSource = function (source, scope) {
        return source.select('.' + SCOPE_PREFIX + scope);
    };
    MockedDOMSource.prototype.isolateSink = function (sink, scope) {
        return adapt_1.adapt(xstream_1.default.fromObservable(sink).map(function (vnode) {
            if (vnode.sel && vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
                return vnode;
            } else {
                vnode.sel += '.' + SCOPE_PREFIX + scope;
                return vnode;
            }
        }));
    };
    return MockedDOMSource;
}();
exports.MockedDOMSource = MockedDOMSource;
function mockDOMSource(mockConfig) {
    return new MockedDOMSource(mockConfig);
}
exports.mockDOMSource = mockDOMSource;
}
// @cycle/dom/lib/cjs/hyperscript-helpers.js
$fsx.f[93] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var h_1 = $fsx.r(125);
function isValidString(param) {
    return typeof param === 'string' && param.length > 0;
}
function isSelector(param) {
    return isValidString(param) && (param[0] === '.' || param[0] === '#');
}
function createTagFunction(tagName) {
    return function hyperscript(a, b, c) {
        var hasA = typeof a !== 'undefined';
        var hasB = typeof b !== 'undefined';
        var hasC = typeof c !== 'undefined';
        if (isSelector(a)) {
            if (hasB && hasC) {
                return h_1.h(tagName + a, b, c);
            } else if (hasB) {
                return h_1.h(tagName + a, b);
            } else {
                return h_1.h(tagName + a, {});
            }
        } else if (hasC) {
            return h_1.h(tagName + a, b, c);
        } else if (hasB) {
            return h_1.h(tagName, a, b);
        } else if (hasA) {
            return h_1.h(tagName, a);
        } else {
            return h_1.h(tagName, {});
        }
    };
}
var SVG_TAG_NAMES = [
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'colorProfile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotlight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'fontFace',
    'fontFaceFormat',
    'fontFaceName',
    'fontFaceSrc',
    'fontFaceUri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'missingGlyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'script',
    'set',
    'stop',
    'style',
    'switch',
    'symbol',
    'text',
    'textPath',
    'title',
    'tref',
    'tspan',
    'use',
    'view',
    'vkern'
];
var svg = createTagFunction('svg');
SVG_TAG_NAMES.forEach(function (tag) {
    svg[tag] = createTagFunction(tag);
});
var TAG_NAMES = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'del',
    'details',
    'dfn',
    'dir',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'keygen',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'menu',
    'meta',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'p',
    'param',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'u',
    'ul',
    'video'
];
var exported = {
    SVG_TAG_NAMES: SVG_TAG_NAMES,
    TAG_NAMES: TAG_NAMES,
    svg: svg,
    isSelector: isSelector,
    createTagFunction: createTagFunction
};
TAG_NAMES.forEach(function (n) {
    exported[n] = createTagFunction(n);
});
exports.default = exported;
}
// @cycle/isolate/lib/cjs/index.js
$fsx.f[94] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
function checkIsolateArgs(dataflowComponent, scope) {
    if (typeof dataflowComponent !== 'function') {
        throw new Error('First argument given to isolate() must be a ' + '\'dataflowComponent\' function');
    }
    if (scope === null) {
        throw new Error('Second argument given to isolate() must not be null');
    }
}
function normalizeScopes(sources, scopes, randomScope) {
    var perChannel = {};
    Object.keys(sources).forEach(function (channel) {
        if (typeof scopes === 'string') {
            perChannel[channel] = scopes;
            return;
        }
        var candidate = scopes[channel];
        if (typeof candidate !== 'undefined') {
            perChannel[channel] = candidate;
            return;
        }
        var wildcard = scopes['*'];
        if (typeof wildcard !== 'undefined') {
            perChannel[channel] = wildcard;
            return;
        }
        perChannel[channel] = randomScope;
    });
    return perChannel;
}
function isolateAllSources(outerSources, scopes) {
    var innerSources = {};
    for (var channel in outerSources) {
        var outerSource = outerSources[channel];
        if (outerSources.hasOwnProperty(channel) && outerSource && scopes[channel] !== null && typeof outerSource.isolateSource === 'function') {
            innerSources[channel] = outerSource.isolateSource(outerSource, scopes[channel]);
        } else if (outerSources.hasOwnProperty(channel)) {
            innerSources[channel] = outerSources[channel];
        }
    }
    return innerSources;
}
function isolateAllSinks(sources, innerSinks, scopes) {
    var outerSinks = {};
    for (var channel in innerSinks) {
        var source = sources[channel];
        var innerSink = innerSinks[channel];
        if (innerSinks.hasOwnProperty(channel) && source && scopes[channel] !== null && typeof source.isolateSink === 'function') {
            outerSinks[channel] = adapt_1.adapt(source.isolateSink(xstream_1.default.fromObservable(innerSink), scopes[channel]));
        } else if (innerSinks.hasOwnProperty(channel)) {
            outerSinks[channel] = innerSinks[channel];
        }
    }
    return outerSinks;
}
var counter = 0;
function newScope() {
    return 'cycle' + ++counter;
}
function isolate(component, scope) {
    if (scope === void 0) {
        scope = newScope();
    }
    checkIsolateArgs(component, scope);
    var randomScope = typeof scope === 'object' ? newScope() : '';
    var scopes = typeof scope === 'string' || typeof scope === 'object' ? scope : scope.toString();
    return function wrappedComponent(outerSources) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var scopesPerChannel = normalizeScopes(outerSources, scopes, randomScope);
        var innerSources = isolateAllSources(outerSources, scopesPerChannel);
        var innerSinks = component.apply(void 0, [innerSources].concat(rest));
        var outerSinks = isolateAllSinks(outerSources, innerSinks, scopesPerChannel);
        return outerSinks;
    };
}
isolate.reset = function () {
    return counter = 0;
};
exports.default = isolate;
function toIsolated(scope) {
    if (scope === void 0) {
        scope = newScope();
    }
    return function (component) {
        return isolate(component, scope);
    };
}
exports.toIsolated = toIsolated;
}
// @cycle/run/lib/adapt.js
$fsx.f[95] = function(module,exports){
var adaptStream = function (x) {
    return x;
};
function setAdapt(f) {
    adaptStream = f;
}
exports.setAdapt = setAdapt;
function adapt(stream) {
    return adaptStream(stream);
}
exports.adapt = adapt;
}
// @cycle/run/lib/index.js
$fsx.f[96] = function(module,exports){
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
function logToConsoleError(err) {
    var target = err.stack || err;
    if (console && console.error) {
        console.error(target);
    } else if (console && console.log) {
        console.log(target);
    }
}
function makeSinkProxies(drivers) {
    var sinkProxies = {};
    for (var name_1 in drivers) {
        if (drivers.hasOwnProperty(name_1)) {
            sinkProxies[name_1] = xstream_1.default.createWithMemory();
        }
    }
    return sinkProxies;
}
function callDrivers(drivers, sinkProxies) {
    var sources = {};
    for (var name_2 in drivers) {
        if (drivers.hasOwnProperty(name_2)) {
            sources[name_2] = drivers[name_2](sinkProxies[name_2], name_2);
            if (sources[name_2] && typeof sources[name_2] === 'object') {
                sources[name_2]._isCycleSource = name_2;
            }
        }
    }
    return sources;
}
function adaptSources(sources) {
    for (var name_3 in sources) {
        if (sources.hasOwnProperty(name_3) && sources[name_3] && typeof sources[name_3]['shamefullySendNext'] === 'function') {
            sources[name_3] = adapt_1.adapt(sources[name_3]);
        }
    }
    return sources;
}
function replicateMany(sinks, sinkProxies) {
    var sinkNames = Object.keys(sinks).filter(function (name) {
        return !!sinkProxies[name];
    });
    var buffers = {};
    var replicators = {};
    sinkNames.forEach(function (name) {
        buffers[name] = {
            _n: [],
            _e: []
        };
        replicators[name] = {
            next: function (x) {
                return buffers[name]._n.push(x);
            },
            error: function (err) {
                return buffers[name]._e.push(err);
            },
            complete: function () {
            }
        };
    });
    var subscriptions = sinkNames.map(function (name) {
        return xstream_1.default.fromObservable(sinks[name]).subscribe(replicators[name]);
    });
    sinkNames.forEach(function (name) {
        var listener = sinkProxies[name];
        var next = function (x) {
            listener._n(x);
        };
        var error = function (err) {
            logToConsoleError(err);
            listener._e(err);
        };
        buffers[name]._n.forEach(next);
        buffers[name]._e.forEach(error);
        replicators[name].next = next;
        replicators[name].error = error;
        replicators[name]._n = next;
        replicators[name]._e = error;
    });
    buffers = null;
    return function disposeReplication() {
        subscriptions.forEach(function (s) {
            return s.unsubscribe();
        });
        sinkNames.forEach(function (name) {
            return sinkProxies[name]._c();
        });
    };
}
function disposeSources(sources) {
    for (var k in sources) {
        if (sources.hasOwnProperty(k) && sources[k] && sources[k].dispose) {
            sources[k].dispose();
        }
    }
}
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function setup(main, drivers) {
    if (typeof main !== 'function') {
        throw new Error('First argument given to Cycle must be the \'main\' ' + 'function.');
    }
    if (typeof drivers !== 'object' || drivers === null) {
        throw new Error('Second argument given to Cycle must be an object ' + 'with driver functions as properties.');
    }
    if (isObjectEmpty(drivers)) {
        throw new Error('Second argument given to Cycle must be an object ' + 'with at least one driver function declared as a property.');
    }
    var sinkProxies = makeSinkProxies(drivers);
    var sources = callDrivers(drivers, sinkProxies);
    var adaptedSources = adaptSources(sources);
    var sinks = main(adaptedSources);
    if ('object' !== 'undefined') {
        window.Cyclejs = window.Cyclejs || {};
        window.Cyclejs.sinks = sinks;
    }
    function run() {
        var disposeReplication = replicateMany(sinks, sinkProxies);
        return function dispose() {
            disposeSources(sources);
            disposeReplication();
        };
    }
    ;
    return {
        sinks: sinks,
        sources: sources,
        run: run
    };
}
exports.setup = setup;
function run(main, drivers) {
    var _a = setup(main, drivers), run = _a.run, sinks = _a.sinks;
    if ('object' !== 'undefined' && window['CyclejsDevTool_startGraphSerializer']) {
        window['CyclejsDevTool_startGraphSerializer'](sinks);
    }
    return run();
}
exports.run = run;
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = run;
}
// child_process/index.js
$fsx.f[97] = function(module,exports){
module.exports = {};
}
// csstips/lib/index.js
$fsx.f[98] = function(module,exports){
function __export(m) {
    for (var p in m)
        if (!exports.hasOwnProperty(p))
            exports[p] = m[p];
}
exports.__esModule = true;
__export($fsx.r(99));
__export($fsx.r(100));
__export($fsx.r(101));
__export($fsx.r(102));
__export($fsx.r(103));
__export($fsx.r(104));
__export($fsx.r(105));
__export($fsx.r(106));
}
// csstips/lib/font.js
$fsx.f[99] = function(module,exports){
exports.__esModule = true;
exports.fontStyleItalic = { fontStyle: 'italic' };
exports.fontWeightNormal = { fontWeight: 'normal' };
exports.fontWeightBold = { fontWeight: 'bold' };
}
// csstips/lib/flex.js
$fsx.f[100] = function(module,exports){
exports.__esModule = true;
var typestyle_1 = $fsx.r(143);
exports.flexRoot = {
    display: [
        '-ms-flexbox',
        '-webkit-flex',
        'flex'
    ]
};
exports.pass = {
    display: 'inherit',
    '-ms-flex-direction': 'inherit',
    '-webkit-flex-direction': 'inherit',
    flexDirection: 'inherit',
    '-ms-flex-positive': 1,
    '-webkit-flex-grow': 1,
    flexGrow: 1
};
exports.inlineRoot = {
    display: [
        '-ms-inline-flexbox',
        '-webkit-inline-flex',
        'inline-flex'
    ]
};
exports.horizontal = typestyle_1.extend(exports.flexRoot, {
    '-ms-flex-direction': 'row',
    '-webkit-flex-direction': 'row',
    flexDirection: 'row'
});
exports.vertical = typestyle_1.extend(exports.flexRoot, {
    '-ms-flex-direction': 'column',
    '-webkit-flex-direction': 'column',
    flexDirection: 'column'
});
exports.wrap = {
    '-ms-flex-wrap': 'wrap',
    '-webkit-flex-wrap': 'wrap',
    flexWrap: 'wrap'
};
exports.content = {
    '-ms-flex-negative': 0,
    '-webkit-flex-shrink': 0,
    flexShrink: 0,
    flexBasis: 'auto'
};
exports.flex = {
    '-ms-flex': 1,
    '-webkit-flex': 1,
    flex: 1
};
exports.flex1 = exports.flex;
exports.flex2 = {
    '-ms-flex': 2,
    '-webkit-flex': 2,
    flex: 2
};
exports.flex3 = {
    '-ms-flex': 3,
    '-webkit-flex': 3,
    flex: 3
};
exports.flex4 = {
    '-ms-flex': 4,
    '-webkit-flex': 4,
    flex: 4
};
exports.flex5 = {
    '-ms-flex': 5,
    '-webkit-flex': 5,
    flex: 5
};
exports.flex6 = {
    '-ms-flex': 6,
    '-webkit-flex': 6,
    flex: 6
};
exports.flex7 = {
    '-ms-flex': 7,
    '-webkit-flex': 7,
    flex: 7
};
exports.flex8 = {
    '-ms-flex': 8,
    '-webkit-flex': 8,
    flex: 8
};
exports.flex9 = {
    '-ms-flex': 9,
    '-webkit-flex': 9,
    flex: 9
};
exports.flex10 = {
    '-ms-flex': 10,
    '-webkit-flex': 10,
    flex: 10
};
exports.flex11 = {
    '-ms-flex': 11,
    '-webkit-flex': 11,
    flex: 11
};
exports.flex12 = {
    '-ms-flex': 12,
    '-webkit-flex': 12,
    flex: 12
};
exports.start = {
    '-ms-flex-align': 'start',
    '-webkit-align-items': 'flex-start',
    alignItems: 'flex-start'
};
exports.center = {
    '-ms-flex-align': 'center',
    '-webkit-align-items': 'center',
    alignItems: 'center'
};
exports.end = {
    '-ms-flex-align': 'end',
    '-webkit-align-items': 'flex-end',
    alignItems: 'flex-end'
};
exports.startJustified = {
    '-ms-flex-pack': 'start',
    '-webkit-justify-content': 'flex-start',
    justifyContent: 'flex-start'
};
exports.centerJustified = {
    '-ms-flex-pack': 'center',
    '-webkit-justify-content': 'center',
    justifyContent: 'center'
};
exports.endJustified = {
    '-ms-flex-pack': 'end',
    '-webkit-justify-content': 'flex-end',
    justifyContent: 'flex-end'
};
exports.aroundJustified = {
    '-ms-flex-pack': 'distribute',
    '-webkit-justify-content': 'space-around',
    justifyContent: 'space-around'
};
exports.betweenJustified = {
    '-ms-flex-pack': 'justify',
    '-webkit-justify-content': 'space-between',
    justifyContent: 'space-between'
};
exports.centerCenter = typestyle_1.extend(exports.flexRoot, exports.center, exports.centerJustified);
exports.selfStart = {
    '-ms-flex-item-align': 'start',
    '-webkit-align-self': 'flex-start',
    alignSelf: 'flex-start'
};
exports.selfCenter = {
    '-ms-flex-item-align': 'center',
    '-webkit-align-self': 'center',
    alignSelf: 'center'
};
exports.selfEnd = {
    '-ms-flex-item-align': 'end',
    '-webkit-align-self': 'flex-end',
    alignSelf: 'flex-end'
};
exports.selfStretch = {
    '-ms-flex-item-align': 'stretch',
    '-webkit-align-self': 'stretch',
    alignSelf: 'stretch'
};
}
// csstips/lib/layer.js
$fsx.f[101] = function(module,exports){
exports.__esModule = true;
var typestyle_1 = $fsx.r(143);
exports.layerParent = { position: 'relative' };
exports.attachToLayerParent = { position: 'absolute' };
exports.newLayer = typestyle_1.extend(exports.attachToLayerParent, {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
});
exports.attachToTop = typestyle_1.extend(exports.attachToLayerParent, {
    top: 0,
    left: 0,
    right: 0
});
exports.attachToRight = typestyle_1.extend(exports.attachToLayerParent, {
    top: 0,
    right: 0,
    bottom: 0
});
exports.attachToBottom = typestyle_1.extend(exports.attachToLayerParent, {
    right: 0,
    bottom: 0,
    left: 0
});
exports.attachToLeft = typestyle_1.extend(exports.attachToLayerParent, {
    top: 0,
    bottom: 0,
    left: 0
});
var fixed = { position: 'fixed' };
exports.pageTop = typestyle_1.extend(fixed, {
    top: 0,
    left: 0,
    right: 0
});
exports.pageRight = typestyle_1.extend(fixed, {
    top: 0,
    right: 0,
    bottom: 0
});
exports.pageBottom = typestyle_1.extend(fixed, {
    right: 0,
    bottom: 0,
    left: 0
});
exports.pageLeft = typestyle_1.extend(fixed, {
    top: 0,
    bottom: 0,
    left: 0
});
}
// csstips/lib/box.js
$fsx.f[102] = function(module,exports){
exports.__esModule = true;
function boxUnitToString(value) {
    if (typeof value === 'number') {
        return value.toString() + 'px';
    } else {
        return value;
    }
}
function createBoxFunction(mapFromBox) {
    var result = function (a, b, c, d) {
        if (b === undefined && c === undefined && d === undefined) {
            b = c = d = a;
        } else if (c === undefined && d === undefined) {
            c = a;
            d = b;
        }
        var box = {
            top: boxUnitToString(a),
            right: boxUnitToString(b),
            bottom: boxUnitToString(c),
            left: boxUnitToString(d)
        };
        return mapFromBox(box);
    };
    return result;
}
exports.padding = createBoxFunction(function (box) {
    return {
        paddingTop: box.top,
        paddingRight: box.right,
        paddingBottom: box.bottom,
        paddingLeft: box.left
    };
});
exports.margin = createBoxFunction(function (box) {
    return {
        marginTop: box.top,
        marginRight: box.right,
        marginBottom: box.bottom,
        marginLeft: box.left
    };
});
exports.border = createBoxFunction(function (box) {
    return {
        borderTop: box.top,
        borderRight: box.right,
        borderBottom: box.bottom,
        borderLeft: box.left
    };
});
exports.verticallySpaced = function (margin) {
    var spacing = boxUnitToString(margin);
    return {
        '&>*': { marginBottom: spacing + ' !important' },
        '&>*:last-child': { marginBottom: '0px !important' }
    };
};
exports.horizontallySpaced = function (margin) {
    var spacing = boxUnitToString(margin);
    return {
        '&>*': { marginRight: spacing + ' !important' },
        '&>*:last-child': { marginRight: '0px !important' }
    };
};
exports.gridSpaced = function (margin) {
    var spacing = boxUnitToString(margin);
    return {
        marginTop: '-' + spacing,
        marginLeft: '-' + spacing,
        '&>*': {
            marginTop: spacing,
            marginLeft: spacing
        }
    };
};
exports.fillParent = {
    width: '100%',
    height: '100%'
};
exports.maxWidth = function (value) {
    var maxWidth = boxUnitToString(value);
    return { maxWidth: maxWidth };
};
exports.maxHeight = function (value) {
    var maxHeight = boxUnitToString(value);
    return { maxHeight: maxHeight };
};
exports.horizontallyCenterSelf = {
    marginLeft: 'auto',
    marginRight: 'auto'
};
exports.horizontallyCenterChildren = { textAlign: 'center' };
exports.height = function (value) {
    var height = boxUnitToString(value);
    return { height: height };
};
exports.width = function (value) {
    var width = boxUnitToString(value);
    return { width: width };
};
}
// csstips/lib/scroll.js
$fsx.f[103] = function(module,exports){
exports.__esModule = true;
exports.scroll = {
    '-webkit-overflow-scrolling': 'touch',
    overflow: 'auto'
};
exports.scrollX = {
    '-webkit-overflow-scrolling': 'touch',
    overflowX: 'auto'
};
exports.scrollY = {
    '-webkit-overflow-scrolling': 'touch',
    overflowY: 'auto'
};
exports.someChildWillScroll = { overflow: 'hidden' };
}
// csstips/lib/display.js
$fsx.f[104] = function(module,exports){
exports.__esModule = true;
exports.block = { display: 'block' };
exports.none = { display: 'none' };
exports.inlineBlock = { display: 'inline-block' };
exports.invisible = { visibility: 'hidden' };
}
// csstips/lib/normalize.js
$fsx.f[105] = function(module,exports){
exports.__esModule = true;
var typestyle_1 = $fsx.r(143);
function normalize() {
    typestyle_1.cssRaw('\n    button,hr,input{overflow:visible}audio,canvas,progress,video{display:inline-block}progress,sub,sup{vertical-align:baseline}html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0} menu,article,aside,details,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{}button,select{text-transform:none}[type=submit], [type=reset],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}[hidden],template{display:none}\n    '.trim());
}
exports.normalize = normalize;
}
// csstips/lib/page.js
$fsx.f[106] = function(module,exports){
exports.__esModule = true;
var typestyle_1 = $fsx.r(143);
var box_1 = $fsx.r(102);
function setupPage(rootSelector) {
    typestyle_1.cssRule('html, body', {
        height: '100%',
        width: '100%',
        padding: 0,
        margin: 0
    });
    typestyle_1.cssRule('html', {
        '-moz-box-sizing': 'border-box',
        '-webkit-box-sizing': 'border-box',
        boxSizing: 'border-box'
    });
    typestyle_1.cssRule('*,*:before,*:after', { boxSizing: 'inherit' });
    typestyle_1.cssRule(rootSelector, box_1.fillParent);
}
exports.setupPage = setupPage;
}
// cycle-onionify/lib/index.js
$fsx.f[107] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var onionify_1 = $fsx.r(108);
var StateSource_1 = $fsx.r(109);
exports.StateSource = StateSource_1.StateSource;
exports.isolateSource = StateSource_1.isolateSource;
exports.isolateSink = StateSource_1.isolateSink;
var Collection_1 = $fsx.r(110);
exports.Instances = Collection_1.Instances;
exports.makeCollection = Collection_1.makeCollection;
var pickMerge_1 = $fsx.r(111);
exports.pickMerge = pickMerge_1.pickMerge;
var pickCombine_1 = $fsx.r(112);
exports.pickCombine = pickCombine_1.pickCombine;
exports.default = onionify_1.onionify;
}
// cycle-onionify/lib/onionify.js
$fsx.f[108] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var concat_1 = $fsx.r(149);
var StateSource_1 = $fsx.r(109);
var quicktask_1 = $fsx.r(116);
var schedule = quicktask_1.default();
function onionify(main, name) {
    if (name === void 0) {
        name = 'onion';
    }
    return function mainOnionified(sources) {
        var reducerMimic$ = xstream_1.default.create();
        var state$ = reducerMimic$.fold(function (state, reducer) {
            return reducer(state);
        }, void 0).drop(1);
        sources[name] = new StateSource_1.StateSource(state$, name);
        var sinks = main(sources);
        if (sinks[name]) {
            var stream$ = concat_1.default(xstream_1.default.fromObservable(sinks[name]), xstream_1.default.never());
            stream$.subscribe({
                next: function (i) {
                    return schedule(function () {
                        return reducerMimic$._n(i);
                    });
                },
                error: function (err) {
                    return schedule(function () {
                        return reducerMimic$._e(err);
                    });
                },
                complete: function () {
                    return schedule(function () {
                        return reducerMimic$._c();
                    });
                }
            });
        }
        return sinks;
    };
}
exports.onionify = onionify;
}
// cycle-onionify/lib/StateSource.js
$fsx.f[109] = function(module,exports){
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, '__esModule', { value: true });
var dropRepeats_1 = $fsx.r(151);
var adapt_1 = $fsx.r(95);
function updateArrayEntry(array, scope, newVal) {
    if (newVal === array[scope]) {
        return array;
    }
    var index = parseInt(scope);
    if (typeof newVal === 'undefined') {
        return array.filter(function (val, i) {
            return i !== index;
        });
    }
    return array.map(function (val, i) {
        return i === index ? newVal : val;
    });
}
function makeGetter(scope) {
    if (typeof scope === 'string' || typeof scope === 'number') {
        return function lensGet(state) {
            if (typeof state === 'undefined') {
                return void 0;
            } else {
                return state[scope];
            }
        };
    } else {
        return scope.get;
    }
}
function makeSetter(scope) {
    if (typeof scope === 'string' || typeof scope === 'number') {
        return function lensSet(state, childState) {
            if (Array.isArray(state)) {
                return updateArrayEntry(state, scope, childState);
            } else if (typeof state === 'undefined') {
                return _a = {}, _a[scope] = childState, _a;
            } else {
                return __assign({}, state, (_b = {}, _b[scope] = childState, _b));
            }
            var _a, _b;
        };
    } else {
        return scope.set;
    }
}
function isolateSource(source, scope) {
    return source.select(scope);
}
exports.isolateSource = isolateSource;
function isolateSink(innerReducer$, scope) {
    var get = makeGetter(scope);
    var set = makeSetter(scope);
    return innerReducer$.map(function (innerReducer) {
        return function outerReducer(outer) {
            var prevInner = get(outer);
            var nextInner = innerReducer(prevInner);
            if (prevInner === nextInner) {
                return outer;
            } else {
                return set(outer, nextInner);
            }
        };
    });
}
exports.isolateSink = isolateSink;
var StateSource = function () {
    function StateSource(stream, name) {
        this.isolateSource = isolateSource;
        this.isolateSink = isolateSink;
        this._state$ = stream.filter(function (s) {
            return typeof s !== 'undefined';
        }).compose(dropRepeats_1.default()).remember();
        this._name = name;
        this.state$ = adapt_1.adapt(this._state$);
        this._state$._isCycleSource = name;
    }
    StateSource.prototype.select = function (scope) {
        var get = makeGetter(scope);
        return new StateSource(this._state$.map(get), this._name);
    };
    return StateSource;
}();
exports.StateSource = StateSource;
}
// cycle-onionify/lib/Collection.js
$fsx.f[110] = function(module,exports){
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var adapt_1 = $fsx.r(95);
var isolate_1 = $fsx.r(94);
var pickMerge_1 = $fsx.r(111);
var pickCombine_1 = $fsx.r(112);
var Instances = function () {
    function Instances(instances$) {
        this._instances$ = instances$;
    }
    Instances.prototype.pickMerge = function (selector) {
        return adapt_1.adapt(this._instances$.compose(pickMerge_1.pickMerge(selector)));
    };
    Instances.prototype.pickCombine = function (selector) {
        return adapt_1.adapt(this._instances$.compose(pickCombine_1.pickCombine(selector)));
    };
    return Instances;
}();
exports.Instances = Instances;
function defaultItemScope(key) {
    return { '*': null };
}
function instanceLens(itemKey, key) {
    return {
        get: function (arr) {
            if (typeof arr === 'undefined') {
                return void 0;
            } else {
                for (var i = 0, n = arr.length; i < n; ++i) {
                    if ('' + itemKey(arr[i], i) === key) {
                        return arr[i];
                    }
                }
                return void 0;
            }
        },
        set: function (arr, item) {
            if (typeof arr === 'undefined') {
                return [item];
            } else if (typeof item === 'undefined') {
                return arr.filter(function (s, i) {
                    return '' + itemKey(s, i) !== key;
                });
            } else {
                return arr.map(function (s, i) {
                    if ('' + itemKey(s, i) === key) {
                        return item;
                    } else {
                        return s;
                    }
                });
            }
        }
    };
}
var identityLens = {
    get: function (outer) {
        return outer;
    },
    set: function (outer, inner) {
        return inner;
    }
};
function makeCollection(opts) {
    return function collectionComponent(sources) {
        var name = opts.channel || 'onion';
        var itemKey = opts.itemKey;
        var itemScope = opts.itemScope || defaultItemScope;
        var itemComp = opts.item;
        var state$ = xstream_1.default.fromObservable(sources[name].state$);
        var instances$ = state$.fold(function (acc, nextState) {
            var dict = acc.dict;
            if (Array.isArray(nextState)) {
                var nextInstArray = Array(nextState.length);
                var nextKeys_1 = new Set();
                for (var i = 0, n = nextState.length; i < n; ++i) {
                    var key = '' + (itemKey ? itemKey(nextState[i], i) : i);
                    nextKeys_1.add(key);
                    if (!dict.has(key)) {
                        var onionScope = itemKey ? instanceLens(itemKey, key) : '' + i;
                        var otherScopes = itemScope(key);
                        var scopes = typeof otherScopes === 'string' ? (_a = { '*': otherScopes }, _a[name] = onionScope, _a) : __assign({}, otherScopes, (_b = {}, _b[name] = onionScope, _b));
                        var sinks = isolate_1.default(itemComp, scopes)(sources);
                        dict.set(key, sinks);
                        nextInstArray[i] = sinks;
                    } else {
                        nextInstArray[i] = dict.get(key);
                    }
                    nextInstArray[i]._key = key;
                }
                dict.forEach(function (_, key) {
                    if (!nextKeys_1.has(key)) {
                        dict.delete(key);
                    }
                });
                nextKeys_1.clear();
                return {
                    dict: dict,
                    arr: nextInstArray
                };
            } else {
                dict.clear();
                var key = '' + (itemKey ? itemKey(nextState, 0) : 'this');
                var onionScope = identityLens;
                var otherScopes = itemScope(key);
                var scopes = typeof otherScopes === 'string' ? (_c = { '*': otherScopes }, _c[name] = onionScope, _c) : __assign({}, otherScopes, (_d = {}, _d[name] = onionScope, _d));
                var sinks = isolate_1.default(itemComp, scopes)(sources);
                dict.set(key, sinks);
                return {
                    dict: dict,
                    arr: [sinks]
                };
            }
            var _a, _b, _c, _d;
        }, {
            dict: new Map(),
            arr: []
        });
        return opts.collectSinks(new Instances(instances$));
    };
}
exports.makeCollection = makeCollection;
}
// cycle-onionify/lib/pickMerge.js
$fsx.f[111] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var PickMergeListener = function () {
    function PickMergeListener(out, p, ins) {
        this.ins = ins;
        this.out = out;
        this.p = p;
    }
    PickMergeListener.prototype._n = function (t) {
        var p = this.p, out = this.out;
        if (out === null) {
            return;
        }
        out._n(t);
    };
    PickMergeListener.prototype._e = function (err) {
        var out = this.out;
        if (out === null) {
            return;
        }
        out._e(err);
    };
    PickMergeListener.prototype._c = function () {
    };
    return PickMergeListener;
}();
var PickMerge = function () {
    function PickMerge(sel, ins) {
        this.type = 'pickMerge';
        this.ins = ins;
        this.out = null;
        this.sel = sel;
        this.ils = new Map();
        this.inst = null;
    }
    PickMerge.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    PickMerge.prototype._stop = function () {
        this.ins._remove(this);
        var ils = this.ils;
        ils.forEach(function (il, key) {
            il.ins._remove(il);
            il.ins = null;
            il.out = null;
            ils.delete(key);
        });
        ils.clear();
        this.out = null;
        this.ils = new Map();
        this.inst = null;
    };
    PickMerge.prototype._n = function (inst) {
        this.inst = inst;
        var arrSinks = inst.arr;
        var ils = this.ils;
        var out = this.out;
        var sel = this.sel;
        var n = arrSinks.length;
        for (var i = 0; i < n; ++i) {
            var sinks = arrSinks[i];
            var key = sinks._key;
            var sink = xstream_1.default.fromObservable(sinks[sel] || xstream_1.default.never());
            if (!ils.has(key)) {
                ils.set(key, new PickMergeListener(out, this, sink));
                sink._add(ils.get(key));
            }
        }
        ils.forEach(function (il, key) {
            if (!inst.dict.has(key) || !inst.dict.get(key)) {
                il.ins._remove(il);
                il.ins = null;
                il.out = null;
                ils.delete(key);
            }
        });
    };
    PickMerge.prototype._e = function (err) {
        var u = this.out;
        if (u === null)
            return;
        u._e(err);
    };
    PickMerge.prototype._c = function () {
        var u = this.out;
        if (u === null)
            return;
        u._c();
    };
    return PickMerge;
}();
function pickMerge(selector) {
    return function pickMergeOperator(inst$) {
        return new xstream_1.Stream(new PickMerge(selector, inst$));
    };
}
exports.pickMerge = pickMerge;
}
// cycle-onionify/lib/pickCombine.js
$fsx.f[112] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xstream_1 = $fsx.r(148);
var PickCombineListener = function () {
    function PickCombineListener(key, out, p, ins) {
        this.key = key;
        this.out = out;
        this.p = p;
        this.val = xstream_1.NO;
        this.ins = ins;
    }
    PickCombineListener.prototype._n = function (t) {
        var p = this.p, out = this.out;
        this.val = t;
        if (out === null) {
            return;
        }
        this.p.up();
    };
    PickCombineListener.prototype._e = function (err) {
        var out = this.out;
        if (out === null) {
            return;
        }
        out._e(err);
    };
    PickCombineListener.prototype._c = function () {
    };
    return PickCombineListener;
}();
var PickCombine = function () {
    function PickCombine(sel, ins) {
        this.type = 'combine';
        this.ins = ins;
        this.sel = sel;
        this.out = null;
        this.ils = new Map();
        this.inst = null;
    }
    PickCombine.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    PickCombine.prototype._stop = function () {
        this.ins._remove(this);
        var ils = this.ils;
        ils.forEach(function (il) {
            il.ins._remove(il);
            il.ins = null;
            il.out = null;
            il.val = null;
        });
        ils.clear();
        this.out = null;
        this.ils = new Map();
        this.inst = null;
    };
    PickCombine.prototype.up = function () {
        var arr = this.inst.arr;
        var n = arr.length;
        var ils = this.ils;
        var outArr = Array(n);
        for (var i = 0; i < n; ++i) {
            var sinks = arr[i];
            var key = sinks._key;
            if (!ils.has(key)) {
                return;
            }
            var val = ils.get(key).val;
            if (val === xstream_1.NO) {
                return;
            }
            outArr[i] = val;
        }
        this.out._n(outArr);
    };
    PickCombine.prototype._n = function (inst) {
        this.inst = inst;
        var arrSinks = inst.arr;
        var ils = this.ils;
        var out = this.out;
        var sel = this.sel;
        var dict = inst.dict;
        var n = arrSinks.length;
        var removed = false;
        ils.forEach(function (il, key) {
            if (!dict.has(key)) {
                il.ins._remove(il);
                il.ins = null;
                il.out = null;
                il.val = null;
                ils.delete(key);
                removed = true;
            }
        });
        if (n === 0) {
            out._n([]);
            return;
        }
        for (var i = 0; i < n; ++i) {
            var sinks = arrSinks[i];
            var key = sinks._key;
            if (!sinks[sel]) {
                throw new Error('pickCombine found an undefined child sink stream');
            }
            var sink = xstream_1.default.fromObservable(sinks[sel]);
            if (!ils.has(key)) {
                ils.set(key, new PickCombineListener(key, out, this, sink));
                sink._add(ils.get(key));
            }
        }
        if (removed) {
            this.up();
        }
    };
    PickCombine.prototype._e = function (e) {
        var out = this.out;
        if (out === null) {
            return;
        }
        out._e(e);
    };
    PickCombine.prototype._c = function () {
        var out = this.out;
        if (out === null) {
            return;
        }
        out._c();
    };
    return PickCombine;
}();
function pickCombine(selector) {
    return function pickCombineOperator(inst$) {
        return new xstream_1.Stream(new PickCombine(selector, inst$));
    };
}
exports.pickCombine = pickCombine;
}
// free-style/dist/free-style.js
$fsx.f[113] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var uniqueId = 0;
exports.IS_UNIQUE = '__DO_NOT_DEDUPE_STYLE__';
var upperCasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var interpolatePattern = /&/g;
var escapePattern = /[ !#$%&()*+,./;<=>?@[\]^`{|}~"'\\]/g;
var propLower = function (m) {
    return '-' + m.toLowerCase();
};
var cssNumberProperties = [
    'animation-iteration-count',
    'box-flex',
    'box-flex-group',
    'column-count',
    'counter-increment',
    'counter-reset',
    'flex',
    'flex-grow',
    'flex-positive',
    'flex-shrink',
    'flex-negative',
    'font-weight',
    'line-clamp',
    'line-height',
    'opacity',
    'order',
    'orphans',
    'tab-size',
    'widows',
    'z-index',
    'zoom',
    'fill-opacity',
    'stroke-dashoffset',
    'stroke-opacity',
    'stroke-width'
];
var CSS_NUMBER = Object.create(null);
for (var _i = 0, _a = [
            '-webkit-',
            '-ms-',
            '-moz-',
            '-o-',
            ''
        ]; _i < _a.length; _i++) {
    var prefix = _a[_i];
    for (var _b = 0, cssNumberProperties_1 = cssNumberProperties; _b < cssNumberProperties_1.length; _b++) {
        var property = cssNumberProperties_1[_b];
        CSS_NUMBER[prefix + property] = true;
    }
}
exports.escape = function (str) {
    return str.replace(escapePattern, '\\$&');
};
function hyphenate(propertyName) {
    return propertyName.replace(upperCasePattern, propLower).replace(msPattern, '-ms-');
}
exports.hyphenate = hyphenate;
function stringHash(str) {
    var value = 5381;
    var len = str.length;
    while (len--)
        value = value * 33 ^ str.charCodeAt(len);
    return (value >>> 0).toString(36);
}
exports.stringHash = stringHash;
function styleToString(key, value) {
    if (typeof value === 'number' && value !== 0 && !CSS_NUMBER[key]) {
        return key + ':' + value + 'px';
    }
    return key + ':' + value;
}
function sortTuples(value) {
    return value.sort(function (a, b) {
        return a[0] > b[0] ? 1 : -1;
    });
}
function parseStyles(styles, hasNestedStyles) {
    var properties = [];
    var nestedStyles = [];
    var isUnique = false;
    for (var _i = 0, _a = Object.keys(styles); _i < _a.length; _i++) {
        var key = _a[_i];
        var value = styles[key];
        if (value !== null && value !== undefined) {
            if (key === exports.IS_UNIQUE) {
                isUnique = true;
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                nestedStyles.push([
                    key.trim(),
                    value
                ]);
            } else {
                properties.push([
                    hyphenate(key.trim()),
                    value
                ]);
            }
        }
    }
    return {
        styleString: stringifyProperties(sortTuples(properties)),
        nestedStyles: hasNestedStyles ? nestedStyles : sortTuples(nestedStyles),
        isUnique: isUnique
    };
}
function stringifyProperties(properties) {
    return properties.map(function (_a) {
        var name = _a[0], value = _a[1];
        if (!Array.isArray(value))
            return styleToString(name, value);
        return value.map(function (x) {
            return styleToString(name, x);
        }).join(';');
    }).join(';');
}
function interpolate(selector, parent) {
    if (selector.indexOf('&') > -1) {
        return selector.replace(interpolatePattern, parent);
    }
    return parent + ' ' + selector;
}
function stylize(cache, selector, styles, list, parent) {
    var _a = parseStyles(styles, !!selector), styleString = _a.styleString, nestedStyles = _a.nestedStyles, isUnique = _a.isUnique;
    var pid = styleString;
    if (selector.charCodeAt(0) === 64) {
        var rule = cache.add(new Rule(selector, parent ? undefined : styleString, cache.hash));
        if (styleString && parent) {
            var style = rule.add(new Style(styleString, rule.hash, isUnique ? 'u' + (++uniqueId).toString(36) : undefined));
            list.push([
                parent,
                style
            ]);
        }
        for (var _i = 0, nestedStyles_1 = nestedStyles; _i < nestedStyles_1.length; _i++) {
            var _b = nestedStyles_1[_i], name = _b[0], value = _b[1];
            pid += name + stylize(rule, name, value, list, parent);
        }
    } else {
        var key = parent ? interpolate(selector, parent) : selector;
        if (styleString) {
            var style = cache.add(new Style(styleString, cache.hash, isUnique ? 'u' + (++uniqueId).toString(36) : undefined));
            list.push([
                key,
                style
            ]);
        }
        for (var _c = 0, nestedStyles_2 = nestedStyles; _c < nestedStyles_2.length; _c++) {
            var _d = nestedStyles_2[_c], name = _d[0], value = _d[1];
            pid += name + stylize(cache, name, value, list, key);
        }
    }
    return pid;
}
function composeStyles(container, selector, styles, isStyle, displayName) {
    var cache = new Cache(container.hash);
    var list = [];
    var pid = stylize(cache, selector, styles, list);
    var hash = 'f' + cache.hash(pid);
    var id = displayName ? displayName + '_' + hash : hash;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var _a = list_1[_i], selector_1 = _a[0], style = _a[1];
        var key = isStyle ? interpolate(selector_1, '.' + exports.escape(id)) : selector_1;
        style.add(new Selector(key, style.hash, undefined, pid));
    }
    return {
        cache: cache,
        pid: pid,
        id: id
    };
}
function join(arr) {
    var res = '';
    for (var i = 0; i < arr.length; i++)
        res += arr[i];
    return res;
}
var noopChanges = {
    add: function () {
        return undefined;
    },
    change: function () {
        return undefined;
    },
    remove: function () {
        return undefined;
    }
};
var Cache = function () {
    function Cache(hash, changes) {
        if (hash === void 0) {
            hash = stringHash;
        }
        if (changes === void 0) {
            changes = noopChanges;
        }
        this.hash = hash;
        this.changes = changes;
        this.sheet = [];
        this.changeId = 0;
        this._keys = [];
        this._children = Object.create(null);
        this._counters = Object.create(null);
    }
    Cache.prototype.add = function (style) {
        var count = this._counters[style.id] || 0;
        var item = this._children[style.id] || style.clone();
        this._counters[style.id] = count + 1;
        if (count === 0) {
            this._children[item.id] = item;
            this._keys.push(item.id);
            this.sheet.push(item.getStyles());
            this.changeId++;
            this.changes.add(item, this._keys.length - 1);
        } else {
            if (item.getIdentifier() !== style.getIdentifier()) {
                throw new TypeError('Hash collision: ' + style.getStyles() + ' === ' + item.getStyles());
            }
            var oldIndex = this._keys.indexOf(style.id);
            var newIndex = this._keys.length - 1;
            var prevChangeId = this.changeId;
            if (oldIndex !== newIndex) {
                this._keys.splice(oldIndex, 1);
                this._keys.push(style.id);
                this.changeId++;
            }
            if (item instanceof Cache && style instanceof Cache) {
                var prevChangeId_1 = item.changeId;
                item.merge(style);
                if (item.changeId !== prevChangeId_1) {
                    this.changeId++;
                }
            }
            if (this.changeId !== prevChangeId) {
                if (oldIndex === newIndex) {
                    this.sheet.splice(oldIndex, 1, item.getStyles());
                } else {
                    this.sheet.splice(oldIndex, 1);
                    this.sheet.splice(newIndex, 0, item.getStyles());
                }
                this.changes.change(item, oldIndex, newIndex);
            }
        }
        return item;
    };
    Cache.prototype.remove = function (style) {
        var count = this._counters[style.id];
        if (count > 0) {
            this._counters[style.id] = count - 1;
            var item = this._children[style.id];
            var index = this._keys.indexOf(item.id);
            if (count === 1) {
                delete this._counters[style.id];
                delete this._children[style.id];
                this._keys.splice(index, 1);
                this.sheet.splice(index, 1);
                this.changeId++;
                this.changes.remove(item, index);
            } else if (item instanceof Cache && style instanceof Cache) {
                var prevChangeId = item.changeId;
                item.unmerge(style);
                if (item.changeId !== prevChangeId) {
                    this.sheet.splice(index, 1, item.getStyles());
                    this.changeId++;
                    this.changes.change(item, index, index);
                }
            }
        }
    };
    Cache.prototype.merge = function (cache) {
        for (var _i = 0, _a = cache._keys; _i < _a.length; _i++) {
            var id = _a[_i];
            this.add(cache._children[id]);
        }
        return this;
    };
    Cache.prototype.unmerge = function (cache) {
        for (var _i = 0, _a = cache._keys; _i < _a.length; _i++) {
            var id = _a[_i];
            this.remove(cache._children[id]);
        }
        return this;
    };
    Cache.prototype.clone = function () {
        return new Cache(this.hash).merge(this);
    };
    return Cache;
}();
exports.Cache = Cache;
var Selector = function () {
    function Selector(selector, hash, id, pid) {
        if (id === void 0) {
            id = 's' + hash(selector);
        }
        if (pid === void 0) {
            pid = '';
        }
        this.selector = selector;
        this.hash = hash;
        this.id = id;
        this.pid = pid;
    }
    Selector.prototype.getStyles = function () {
        return this.selector;
    };
    Selector.prototype.getIdentifier = function () {
        return this.pid + '.' + this.selector;
    };
    Selector.prototype.clone = function () {
        return new Selector(this.selector, this.hash, this.id, this.pid);
    };
    return Selector;
}();
exports.Selector = Selector;
var Style = function (_super) {
    __extends(Style, _super);
    function Style(style, hash, id) {
        if (id === void 0) {
            id = 'c' + hash(style);
        }
        var _this = _super.call(this, hash) || this;
        _this.style = style;
        _this.hash = hash;
        _this.id = id;
        return _this;
    }
    Style.prototype.getStyles = function () {
        return this.sheet.join(',') + '{' + this.style + '}';
    };
    Style.prototype.getIdentifier = function () {
        return this.style;
    };
    Style.prototype.clone = function () {
        return new Style(this.style, this.hash, this.id).merge(this);
    };
    return Style;
}(Cache);
exports.Style = Style;
var Rule = function (_super) {
    __extends(Rule, _super);
    function Rule(rule, style, hash, id, pid) {
        if (style === void 0) {
            style = '';
        }
        if (id === void 0) {
            id = 'a' + hash(rule + '.' + style);
        }
        if (pid === void 0) {
            pid = '';
        }
        var _this = _super.call(this, hash) || this;
        _this.rule = rule;
        _this.style = style;
        _this.hash = hash;
        _this.id = id;
        _this.pid = pid;
        return _this;
    }
    Rule.prototype.getStyles = function () {
        return this.rule + '{' + this.style + join(this.sheet) + '}';
    };
    Rule.prototype.getIdentifier = function () {
        return this.pid + '.' + this.rule + '.' + this.style;
    };
    Rule.prototype.clone = function () {
        return new Rule(this.rule, this.style, this.hash, this.id, this.pid).merge(this);
    };
    return Rule;
}(Cache);
exports.Rule = Rule;
var FreeStyle = function (_super) {
    __extends(FreeStyle, _super);
    function FreeStyle(hash, debug, id, changes) {
        if (hash === void 0) {
            hash = stringHash;
        }
        if (debug === void 0) {
            debug = typeof process !== 'undefined' && 'production' !== 'production';
        }
        if (id === void 0) {
            id = 'f' + (++uniqueId).toString(36);
        }
        var _this = _super.call(this, hash, changes) || this;
        _this.hash = hash;
        _this.debug = debug;
        _this.id = id;
        return _this;
    }
    FreeStyle.prototype.registerStyle = function (styles, displayName) {
        var debugName = this.debug ? displayName : undefined;
        var _a = composeStyles(this, '&', styles, true, debugName), cache = _a.cache, id = _a.id;
        this.merge(cache);
        return id;
    };
    FreeStyle.prototype.registerKeyframes = function (keyframes, displayName) {
        return this.registerHashRule('@keyframes', keyframes, displayName);
    };
    FreeStyle.prototype.registerHashRule = function (prefix, styles, displayName) {
        var debugName = this.debug ? displayName : undefined;
        var _a = composeStyles(this, '', styles, false, debugName), cache = _a.cache, pid = _a.pid, id = _a.id;
        var rule = new Rule(prefix + ' ' + exports.escape(id), undefined, this.hash, undefined, pid);
        this.add(rule.merge(cache));
        return id;
    };
    FreeStyle.prototype.registerRule = function (rule, styles) {
        this.merge(composeStyles(this, rule, styles, false).cache);
    };
    FreeStyle.prototype.registerCss = function (styles) {
        this.merge(composeStyles(this, '', styles, false).cache);
    };
    FreeStyle.prototype.getStyles = function () {
        return join(this.sheet);
    };
    FreeStyle.prototype.getIdentifier = function () {
        return this.id;
    };
    FreeStyle.prototype.clone = function () {
        return new FreeStyle(this.hash, this.debug, this.id, this.changes).merge(this);
    };
    return FreeStyle;
}(Cache);
exports.FreeStyle = FreeStyle;
function create(hash, debug, changes) {
    return new FreeStyle(hash, debug, undefined, changes);
}
exports.create = create;
}
// fs/index.js
$fsx.f[114] = function(module,exports){
module.exports = {};
}
// quicktask/index.js
$fsx.f[116] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function microtask() {
    if (typeof MutationObserver !== 'undefined') {
        var node_1 = document.createTextNode('');
        var queue_1 = [];
        var i_1 = 0;
        new MutationObserver(function () {
            while (queue_1.length) {
                queue_1.shift()();
            }
        }).observe(node_1, { characterData: true });
        return function (fn) {
            queue_1.push(fn);
            node_1.data = i_1 = 1 - i_1;
        };
    } else if (typeof setImmediate !== 'undefined') {
        return setImmediate;
    } else if (typeof process !== 'undefined') {
        return process.nextTick;
    } else {
        return setTimeout;
    }
}
exports.default = microtask;
}
// rambda/dist/rambda.js
$fsx.f[117] = function(module,exports){
function n(n) {
    return function (r) {
        for (var t = [], e = arguments.length - 1; e-- > 0;)
            t[e] = arguments[e + 1];
        var o = 0;
        return n.apply(null, [function () {
                for (var n = [], t = arguments.length; t--;)
                    n[t] = arguments[t];
                return r.apply(null, n.concat([o++]));
            }].concat(t));
    };
}
function r(n, t) {
    if (void 0 === t)
        return function (t) {
            return r(n, t);
        };
    if (void 0 === t.length)
        return function (n, r) {
            var t = {};
            for (var e in r)
                n(r[e], e) && (t[e] = r[e]);
            return t;
        }(n, t);
    for (var e = -1, o = 0, u = t.length, i = []; ++e < u;) {
        var f = t[e];
        n(f) && (i[o++] = f);
    }
    return i;
}
function t(n, r) {
    if (void 0 === r)
        return function (r) {
            return t(n, r);
        };
    for (var e = 0; e < r.length;) {
        if (n(r[e]))
            return !0;
        e++;
    }
    return !1;
}
function e() {
    for (var n = [], r = arguments.length; r--;)
        n[r] = arguments[r];
    return function () {
        for (var r = [], t = arguments.length; t--;)
            r[t] = arguments[t];
        var e = n.slice();
        if (e.length > 0) {
            for (var o = e.pop().apply(void 0, r); e.length > 0;)
                o = e.pop()(o);
            return o;
        }
    };
}
function o(n) {
    var r = typeof n;
    if (null === n)
        return 'Null';
    if (void 0 === n)
        return 'Undefined';
    if ('boolean' === r)
        return 'Boolean';
    if ('number' === r)
        return 'Number';
    if ('string' === r)
        return 'String';
    if (Array.isArray(n))
        return 'Array';
    if (n instanceof RegExp)
        return 'RegExp';
    var t = n.toString();
    return t.startsWith('async') ? 'Async' : '[object Promise]' === t ? 'Promise' : t.includes('function') || t.includes('=>') ? 'Function' : 'Object';
}
function u(n, r) {
    if (1 === arguments.length)
        return function (r) {
            return u(n, r);
        };
    if (n === r)
        return !0;
    var t = o(n);
    if (t !== o(r))
        return !1;
    if ('Array' === t) {
        var e = Array.from(n), i = Array.from(r);
        if (e.toString() !== i.toString())
            return !1;
        var f = !0;
        return e.forEach(function (n, r) {
            f && (n === i[r] || u(n, i[r]) || (f = !1));
        }), f;
    }
    if ('Object' === t) {
        var c = Object.keys(n);
        if (c.length !== Object.keys(r).length)
            return !1;
        var s = !0;
        return c.forEach(function (t) {
            if (s) {
                var e = n[t], o = r[t];
                e === o || u(e, o) || (s = !1);
            }
        }), s;
    }
    return !1;
}
function i(n, r) {
    if (void 0 === r)
        return function (r) {
            return i(n, r);
        };
    for (var t = -1, e = !1; ++t < r.length && !e;)
        u(r[t], n) && (e = !0);
    return e;
}
function f(n, r) {
    return void 0 === r && (r = []), function () {
        for (var t, e = [], o = arguments.length; o--;)
            e[o] = arguments[o];
        return (t = r.concat(e)).length >= n.length ? n.apply(void 0, t) : f(n, t);
    };
}
function c(n, r) {
    return 1 === arguments.length ? function (r) {
        return c(n, r);
    } : void 0 === r || null === r || !0 === Number.isNaN(r) ? n : r;
}
function s(n, r) {
    return void 0 === r ? function (r) {
        return s(n, r);
    } : r.slice(n);
}
function p(n, r) {
    if (void 0 === r)
        return function (r) {
            return p(n, r);
        };
    if (void 0 === r.length)
        return function (n, r) {
            var t = {};
            for (var e in r)
                t[e] = n(r[e], e);
            return t;
        }(n, r);
    for (var t = -1, e = r.length, o = Array(e); ++t < e;)
        o[t] = n(r[t]);
    return o;
}
function a(n, r, t) {
    var e = -1, o = n.length;
    (t = t > o ? o : t) < 0 && (t += o), o = r > t ? 0 : t - r >>> 0, r >>>= 0;
    for (var u = Array(o); ++e < o;)
        u[e] = n[e + r];
    return u;
}
function l(n, r) {
    return void 0 === r ? function (r) {
        return l(n, r);
    } : Object.assign({}, n, r);
}
function v(n, r) {
    if (1 === arguments.length)
        return function (r) {
            return v(n, r);
        };
    if (null !== r && void 0 !== r) {
        for (var t = r, e = 0, o = 'string' == typeof n ? n.split('.') : n; e < o.length;) {
            if (null === t || void 0 === t)
                return;
            t = t[o[e]], e++;
        }
        return t;
    }
}
var d = f(function (n, r, t) {
    return c(n, v(r, t));
});
function x(n, r) {
    if (void 0 === r)
        return function (r) {
            return x(n, r);
        };
    for (var t = [], e = n; e < r; e++)
        t.push(e);
    return t;
}
function h(n, r, t) {
    return void 0 === r ? function (r, t) {
        return h(n, r, t);
    } : void 0 === t ? function (t) {
        return h(n, r, t);
    } : t.reduce(n, r);
}
exports.add = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r + t;
}, exports.addIndex = n, exports.adjust = function n(r, t, e) {
    return void 0 === t ? function (t, e) {
        return n(r, t, e);
    } : void 0 === e ? function (e) {
        return n(r, t, e);
    } : e.concat().map(function (n, o) {
        return o === t ? r(e[t]) : n;
    });
}, exports.all = function n(t, e) {
    return void 0 === e ? function (r) {
        return n(t, r);
    } : r(t, e).length === e.length;
}, exports.allPass = function n(r, e) {
    return 1 === arguments.length ? function (t) {
        return n(r, t);
    } : !t(function (n) {
        return !n(e);
    }, r);
}, exports.always = function (n) {
    return function () {
        return n;
    };
}, exports.any = t, exports.anyPass = function n(r, e) {
    return 1 === arguments.length ? function (t) {
        return n(r, t);
    } : t(function (n) {
        return n(e);
    })(r);
}, exports.append = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    if ('string' == typeof t)
        return '' + t + r;
    var e = t.concat();
    return e.push(r), e;
}, exports.both = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : function (n) {
        return r(n) && t(n);
    };
}, exports.complement = function (n) {
    return function (r) {
        return !n(r);
    };
}, exports.compose = e, exports.concat = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : 'string' == typeof r ? '' + r + t : r.concat(t);
}, exports.contains = i, exports.curry = f, exports.dec = function (n) {
    return n - 1;
}, exports.defaultTo = c, exports.dissoc = function n(r, t) {
    if (1 === arguments.length)
        return function (t) {
            return n(r, t);
        };
    if (null !== t && void 0 !== t) {
        var e = {};
        for (var o in t)
            o !== '' + r && (e[o] = t[o]);
        return e;
    }
}, exports.divide = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r / t;
}, exports.drop = s, exports.dropLast = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.slice(0, -r);
}, exports.either = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : function (n) {
        return r(n) || t(n);
    };
}, exports.endsWith = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.endsWith(r);
}, exports.equals = u, exports.F = function () {
    return !1;
}, exports.filter = r, exports.find = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.find(r);
}, exports.findIndex = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    for (var e = t.length, o = -1; ++o < e;)
        if (r(t[o]))
            return o;
    return -1;
}, exports.flatten = function n(r, t) {
    t = void 0 === t ? [] : t;
    for (var e = 0; e < r.length; e++)
        Array.isArray(r[e]) ? n(r[e], t) : t.push(r[e]);
    return t;
}, exports.flip = function (n) {
    for (var r = [], t = arguments.length - 1; t-- > 0;)
        r[t] = arguments[t + 1];
    return function (n) {
        return function () {
            for (var r = [], t = arguments.length; t--;)
                r[t] = arguments[t];
            return 1 === r.length ? function (t) {
                return n(t, r[0]);
            } : 2 === r.length ? n(r[1], r[0]) : void 0;
        };
    }(n);
}, exports.forEach = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : (p(r, t), t);
}, exports.groupBy = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    for (var e = {}, o = 0; o < t.length; o++) {
        var u = t[o], i = r(u);
        e[i] || (e[i] = []), e[i].push(u);
    }
    return e;
}, exports.has = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : void 0 !== t[r];
}, exports.head = function (n) {
    return 'string' == typeof n ? n[0] || '' : n[0];
}, exports.identity = function (n) {
    return n;
}, exports.ifElse = function n(r, t, e) {
    return void 0 === t ? function (t, e) {
        return n(r, t, e);
    } : void 0 === e ? function (e) {
        return n(r, t, e);
    } : function (n) {
        return !0 === ('boolean' == typeof r ? r : r(n)) ? t(n) : e(n);
    };
}, exports.inc = function (n) {
    return n + 1;
}, exports.includes = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.includes(r);
}, exports.indexBy = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    for (var e = {}, o = 0; o < t.length; o++) {
        var u = t[o];
        e[r(u)] = u;
    }
    return e;
}, exports.indexOf = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    for (var e = -1, o = t.length; ++e < o;)
        if (t[e] === r)
            return e;
    return -1;
}, exports.init = function (n) {
    return 'string' == typeof n ? n.slice(0, -1) : n.length ? a(n, 0, -1) : [];
}, exports.is = function n(r, t) {
    return 1 === arguments.length ? function (t) {
        return n(r, t);
    } : null != t && t.constructor === r || t instanceof r;
}, exports.isNil = function (n) {
    return void 0 === n || null === n;
}, exports.join = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.join(r);
}, exports.keys = function (n) {
    return Object.keys(n);
}, exports.last = function (n) {
    return 'string' == typeof n ? n[n.length - 1] || '' : n[n.length - 1];
}, exports.lastIndexOf = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    var e = -1;
    return t.map(function (n, t) {
        u(n, r) && (e = t);
    }), e;
}, exports.length = function (n) {
    return n.length;
}, exports.map = p, exports.match = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    var e = t.match(r);
    return null === e ? [] : e;
}, exports.merge = l, exports.max = function n(r, t) {
    return 1 === arguments.length ? function (t) {
        return n(r, t);
    } : t > r ? t : r;
}, exports.maxBy = function n(r, t, e) {
    return 2 === arguments.length ? function (e) {
        return n(r, t, e);
    } : 1 === arguments.length ? function (t, e) {
        return n(r, t, e);
    } : r(e) > r(t) ? e : t;
}, exports.min = function n(r, t) {
    return 1 === arguments.length ? function (t) {
        return n(r, t);
    } : t < r ? t : r;
}, exports.minBy = function n(r, t, e) {
    return 2 === arguments.length ? function (e) {
        return n(r, t, e);
    } : 1 === arguments.length ? function (t, e) {
        return n(r, t, e);
    } : r(e) < r(t) ? e : t;
}, exports.modulo = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r % t;
}, exports.multiply = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r * t;
}, exports.none = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : 0 === t.filter(r).length;
}, exports.not = function (n) {
    return !n;
}, exports.nth = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    var e = r < 0 ? t.length + r : r;
    return '[object String]' === Object.prototype.toString.call(t) ? t.charAt(e) : t[e];
}, exports.omit = function n(r, t) {
    if (1 === arguments.length)
        return function (t) {
            return n(r, t);
        };
    if (null !== t && void 0 !== t) {
        var e = 'string' == typeof r ? r = r.split(',') : r, o = {};
        for (var u in t)
            e.includes(u) || (o[u] = t[u]);
        return o;
    }
}, exports.partialCurry = function (n, r) {
    return void 0 === r && (r = {}), function (t) {
        return 'Async' === o(n) || 'Promise' === o(n) ? new Promise(function (e, o) {
            n(l(t, r)).then(e).catch(o);
        }) : n(l(t, r));
    };
}, exports.path = v, exports.pathOr = d, exports.pick = function n(r, t) {
    if (1 === arguments.length)
        return function (t) {
            return n(r, t);
        };
    if (null !== t && void 0 !== t) {
        for (var e = 'string' == typeof r ? r.split(',') : r, o = {}, u = 0; u < e.length;)
            e[u] in t && (o[e[u]] = t[e[u]]), u++;
        return o;
    }
}, exports.pickAll = function n(r, t) {
    if (1 === arguments.length)
        return function (t) {
            return n(r, t);
        };
    if (null !== t && void 0 !== t) {
        for (var e = 'string' == typeof r ? r.split(',') : r, o = {}, u = 0; u < e.length;)
            o[e[u]] = e[u] in t ? t[e[u]] : void 0, u++;
        return o;
    }
}, exports.pipe = function () {
    for (var n = [], r = arguments.length; r--;)
        n[r] = arguments[r];
    return e.apply(void 0, n.reverse());
}, exports.pluck = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    var e = [];
    return p(function (n) {
        void 0 !== n[r] && e.push(n[r]);
    }, t), e;
}, exports.prepend = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    if ('string' == typeof t)
        return '' + r + t;
    var e = t.concat();
    return e.unshift(r), e;
}, exports.prop = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t[r];
}, exports.propEq = function n(r, t, e) {
    return void 0 === t ? function (t, e) {
        return n(r, t, e);
    } : void 0 === e ? function (e) {
        return n(r, t, e);
    } : e[r] === t;
}, exports.range = x, exports.reduce = h, exports.reject = function n(t, e) {
    return void 0 === e ? function (r) {
        return n(t, r);
    } : r(function (n) {
        return !t(n);
    }, e);
}, exports.repeat = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : Array(t).fill(r);
}, exports.replace = function n(r, t, e) {
    return void 0 === t ? function (t, e) {
        return n(r, t, e);
    } : void 0 === e ? function (e) {
        return n(r, t, e);
    } : e.replace(r, t);
}, exports.reverse = function (n) {
    return n.concat().reverse();
}, exports.sort = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.concat().sort(r);
}, exports.sortBy = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.concat().sort(function (n, t) {
        var e = r(n), o = r(t);
        return e < o ? -1 : e > o ? 1 : 0;
    });
}, exports.split = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.split(r);
}, exports.splitEvery = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    for (var e = r > 1 ? r : 1, o = [], u = 0; u < t.length;)
        o.push(t.slice(u, u += e));
    return o;
}, exports.startsWith = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : t.startsWith(r);
}, exports.subtract = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r - t;
}, exports.T = function () {
    return !0;
}, exports.tail = function (n) {
    return s(1, n);
}, exports.take = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : 'string' == typeof t ? t.slice(0, r) : a(t, 0, r);
}, exports.takeLast = function n(r, t) {
    if (void 0 === t)
        return function (t) {
            return n(r, t);
        };
    var e = t.length, o = r > e ? e : r;
    return 'string' == typeof t ? t.slice(e - o) : a(t, o = e - o, e);
}, exports.tap = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : (r(t), t);
}, exports.test = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : -1 !== t.search(r);
}, exports.times = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : p(r, x(0, t));
}, exports.toLower = function (n) {
    return n.toLowerCase();
}, exports.toString = function (n) {
    return n.toString();
}, exports.toUpper = function (n) {
    return n.toUpperCase();
}, exports.trim = function (n) {
    return n.trim();
}, exports.type = o, exports.uniq = function (n) {
    for (var r = -1, t = []; ++r < n.length;) {
        var e = n[r];
        i(e, t) || t.push(e);
    }
    return t;
}, exports.uniqWith = function n(r, e) {
    if (1 === arguments.length)
        return function (t) {
            return n(r, t);
        };
    for (var o = -1, u = [], i = function () {
                var n = e[o];
                t(function (t) {
                    return r(n, t);
                }, u) || u.push(n);
            }; ++o < e.length;)
        i();
    return u;
}, exports.update = function n(r, t, e) {
    return void 0 === t ? function (t, e) {
        return n(r, t, e);
    } : void 0 === e ? function (e) {
        return n(r, t, e);
    } : e.concat().fill(t, r, r + 1);
}, exports.values = function (n) {
    var r = [];
    for (var t in n)
        r.push(n[t]);
    return r;
}, exports.without = function (n, r) {
    return h(function (r, t) {
        return i(t, n) ? r : r.concat(t);
    }, [], r);
}, exports.zip = function r(t, e) {
    return void 0 === e ? function (n) {
        return r(t, n);
    } : n(h)(function (n, r, t) {
        return e[t] ? n.concat([[
                r,
                e[t]
            ]]) : n;
    }, [], t);
}, exports.zipObj = function n(r, t) {
    return void 0 === t ? function (t) {
        return n(r, t);
    } : r.reduce(function (n, r, e) {
        return n[r] = t[e], n;
    }, {});
};
}
// snabbdom-selector/lib/index.js
$fsx.f[118] = function(module,exports){
var curry2_1 = $fsx.r(119);
var findMatches_1 = $fsx.r(120);
exports.select = curry2_1.curry2(findMatches_1.findMatches);
var selectorParser_1 = $fsx.r(122);
exports.selectorParser = selectorParser_1.selectorParser;
var classNameFromVNode_1 = $fsx.r(123);
exports.classNameFromVNode = classNameFromVNode_1.classNameFromVNode;
}
// snabbdom-selector/lib/curry2.js
$fsx.f[119] = function(module,exports){
function curry2(select) {
    return function selector(sel, vNode) {
        switch (arguments.length) {
        case 0:
            return select;
        case 1:
            return function (_vNode) {
                return select(sel, _vNode);
            };
        default:
            return select(sel, vNode);
        }
    };
}
exports.curry2 = curry2;
;
}
// snabbdom-selector/lib/findMatches.js
$fsx.f[120] = function(module,exports){
var query_1 = $fsx.r(121);
var parent_symbol_1 = $fsx.r(124);
function findMatches(cssSelector, vNode) {
    traverseVNode(vNode, addParent);
    return query_1.querySelector(cssSelector, vNode);
}
exports.findMatches = findMatches;
function traverseVNode(vNode, f) {
    function recurse(currentNode, isParent, parentVNode) {
        var length = currentNode.children && currentNode.children.length || 0;
        for (var i = 0; i < length; ++i) {
            var children = currentNode.children;
            if (children && children[i] && typeof children[i] !== 'string') {
                var child = children[i];
                recurse(child, false, currentNode);
            }
        }
        f(currentNode, isParent, isParent ? void 0 : parentVNode);
    }
    recurse(vNode, true);
}
function addParent(vNode, isParent, parent) {
    if (isParent) {
        return void 0;
    }
    if (!vNode.data) {
        vNode.data = {};
    }
    if (!vNode.data[parent_symbol_1.default]) {
        Object.defineProperty(vNode.data, parent_symbol_1.default, { value: parent });
    }
}
}
// snabbdom-selector/lib/query.js
$fsx.f[121] = function(module,exports){
var tree_selector_1 = $fsx.r(139);
var selectorParser_1 = $fsx.r(122);
var classNameFromVNode_1 = $fsx.r(123);
var parent_symbol_1 = $fsx.r(124);
var options = {
    tag: function (vNode) {
        return selectorParser_1.selectorParser(vNode).tagName;
    },
    className: function (vNode) {
        return classNameFromVNode_1.classNameFromVNode(vNode);
    },
    id: function (vNode) {
        return selectorParser_1.selectorParser(vNode).id || '';
    },
    children: function (vNode) {
        return vNode.children || [];
    },
    parent: function (vNode) {
        return vNode.data[parent_symbol_1.default] || vNode;
    },
    contents: function (vNode) {
        return vNode.text || '';
    },
    attr: function (vNode, attr) {
        if (vNode.data) {
            var _a = vNode.data, _b = _a.attrs, attrs = _b === void 0 ? {} : _b, _c = _a.props, props = _c === void 0 ? {} : _c;
            if (attrs[attr]) {
                return attrs[attr];
            }
            if (props[attr]) {
                return props[attr];
            }
        }
    }
};
var matches = tree_selector_1.createMatches(options);
function customMatches(sel, vnode) {
    var data = vnode.data;
    var selector = matches.bind(null, sel);
    if (data && data.fn) {
        var n = void 0;
        if (Array.isArray(data.args)) {
            n = data.fn.apply(null, data.args);
        } else if (data.args) {
            n = data.fn.call(null, data.args);
        } else {
            n = data.fn();
        }
        return selector(n) ? n : false;
    }
    return selector(vnode);
}
exports.querySelector = tree_selector_1.createQuerySelector(options, customMatches);
}
// snabbdom-selector/lib/selectorParser.js
$fsx.f[122] = function(module,exports){
function selectorParser(node) {
    if (!node.sel) {
        return {
            tagName: '',
            id: '',
            className: ''
        };
    }
    var sel = node.sel;
    var hashIdx = sel.indexOf('#');
    var dotIdx = sel.indexOf('.', hashIdx);
    var hash = hashIdx > 0 ? hashIdx : sel.length;
    var dot = dotIdx > 0 ? dotIdx : sel.length;
    var tagName = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
    var id = hash < dot ? sel.slice(hash + 1, dot) : void 0;
    var className = dotIdx > 0 ? sel.slice(dot + 1).replace(/\./g, ' ') : void 0;
    return {
        tagName: tagName,
        id: id,
        className: className
    };
}
exports.selectorParser = selectorParser;
}
// snabbdom-selector/lib/classNameFromVNode.js
$fsx.f[123] = function(module,exports){
var selectorParser_1 = $fsx.r(122);
function classNameFromVNode(vNode) {
    var _a = selectorParser_1.selectorParser(vNode).className, cn = _a === void 0 ? '' : _a;
    if (!vNode.data) {
        return cn;
    }
    var _b = vNode.data, dataClass = _b.class, props = _b.props;
    if (dataClass) {
        var c = Object.keys(dataClass).filter(function (cl) {
            return dataClass[cl];
        });
        cn += ' ' + c.join(' ');
    }
    if (props && props.className) {
        cn += ' ' + props.className;
    }
    return cn && cn.trim();
}
exports.classNameFromVNode = classNameFromVNode;
}
// snabbdom-selector/lib/parent-symbol.js
$fsx.f[124] = function(module,exports){
var root;
if (typeof self !== 'undefined') {
    root = self;
} else if ('object' !== 'undefined') {
    root = window;
} else if ('undefined' !== 'undefined') {
    root = global;
} else {
    root = Function('return this')();
}
var Symbol = root.Symbol;
var parentSymbol;
if (typeof Symbol === 'function') {
    parentSymbol = Symbol('parent');
} else {
    parentSymbol = '@@snabbdom-selector-parent';
}
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = parentSymbol;
}
// snabbdom/h.js
$fsx.f[125] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var vnode_1 = $fsx.r(126);
var is = $fsx.r(127);
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        } else if (is.primitive(c)) {
            text = c;
        } else if (c && c.sel) {
            children = [c];
        }
    } else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        } else if (is.primitive(b)) {
            text = b;
        } else if (b && b.sel) {
            children = [b];
        } else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;
}
// snabbdom/vnode.js
$fsx.f[126] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return {
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key
    };
}
exports.vnode = vnode;
exports.default = vnode;
}
// snabbdom/is.js
$fsx.f[127] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;
}
// snabbdom/snabbdom.js
$fsx.f[128] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var vnode_1 = $fsx.r(126);
var is = $fsx.r(127);
var htmldomapi_1 = $fsx.r(129);
function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}
var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = [
    'create',
    'update',
    'remove',
    'destroy',
    'pre',
    'post'
];
var h_1 = $fsx.r(125);
exports.h = h_1.h;
var thunk_1 = $fsx.r(130);
exports.thunk = thunk_1.thunk;
function init(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        } else if (sel !== undefined) {
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            } else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook;
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        } else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== 'string') {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    } else {
                        rm();
                    }
                } else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx];
            } else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            } else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    } else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            } else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            } else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            } else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        } else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        } else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
exports.init = init;
}
// snabbdom/htmldomapi.js
$fsx.f[129] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment
};
exports.default = exports.htmlDomApi;
}
// snabbdom/thunk.js
$fsx.f[130] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var h_1 = $fsx.r(125);
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i, old = oldVnode.data, cur = thunk.data;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: {
            init: init,
            prepatch: prepatch
        },
        fn: fn,
        args: args
    });
};
exports.default = exports.thunk;
}
// snabbdom/tovnode.js
$fsx.f[131] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var vnode_1 = $fsx.r(126);
var htmldomapi_1 = $fsx.r(129);
function toVNode(node, domApi) {
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    var text;
    if (api.isElement(node)) {
        var id = node.id ? '#' + node.id : '';
        var cn = node.getAttribute('class');
        var c = cn ? '.' + cn.split(' ').join('.') : '';
        var sel = api.tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            name_1 = elmAttrs[i].nodeName;
            if (name_1 !== 'id' && name_1 !== 'class') {
                attrs[name_1] = elmAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
            children.push(toVNode(elmChildren[i]));
        }
        return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
    } else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode_1.default(undefined, undefined, undefined, text, node);
    } else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode_1.default('!', {}, [], text, node);
    } else {
        return vnode_1.default('', {}, [], undefined, node);
    }
}
exports.toVNode = toVNode;
exports.default = toVNode;
}
// snabbdom/modules/class.js
$fsx.f[132] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
exports.classModule = {
    create: updateClass,
    update: updateClass
};
exports.default = exports.classModule;
}
// snabbdom/modules/props.js
$fsx.f[133] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = {
    create: updateProps,
    update: updateProps
};
exports.default = exports.propsModule;
}
// snabbdom/modules/attributes.js
$fsx.f[134] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58;
var xChar = 120;
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (cur === true) {
                elm.setAttribute(key, '');
            } else if (cur === false) {
                elm.removeAttribute(key);
            } else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                } else if (key.charCodeAt(3) === colonChar) {
                    elm.setAttributeNS(xmlNS, key, cur);
                } else if (key.charCodeAt(5) === colonChar) {
                    elm.setAttributeNS(xlinkNS, key, cur);
                } else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
exports.attributesModule = {
    create: updateAttrs,
    update: updateAttrs
};
exports.default = exports.attributesModule;
}
// snabbdom/modules/style.js
$fsx.f[135] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var raf = 'object' !== 'undefined' && window.requestAnimationFrame || setTimeout;
var nextFrame = function (fn) {
    raf(function () {
        raf(fn);
    });
};
function setNextFrame(obj, prop, val) {
    nextFrame(function () {
        obj[prop] = val;
    });
}
function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            } else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) {
            for (var name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        } else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            } else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
exports.styleModule = {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
exports.default = exports.styleModule;
}
// snabbdom/modules/dataset.js
$fsx.f[136] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var CAPS_REGEX = /[A-Z]/g;
function updateDataset(oldVnode, vnode) {
    var elm = vnode.elm, oldDataset = oldVnode.data.dataset, dataset = vnode.data.dataset, key;
    if (!oldDataset && !dataset)
        return;
    if (oldDataset === dataset)
        return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    var d = elm.dataset;
    for (key in oldDataset) {
        if (!dataset[key]) {
            if (d) {
                if (key in d) {
                    delete d[key];
                }
            } else {
                elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) {
            if (d) {
                d[key] = dataset[key];
            } else {
                elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
            }
        }
    }
}
exports.datasetModule = {
    create: updateDataset,
    update: updateDataset
};
exports.default = exports.datasetModule;
}
// symbol-observable/lib/index.js
$fsx.f[137] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var _ponyfill = $fsx.r(138);
var _ponyfill2 = _interopRequireDefault(_ponyfill);
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}
var root;
if (typeof self !== 'undefined') {
    root = self;
} else if ('object' !== 'undefined') {
    root = window;
} else if ('undefined' !== 'undefined') {
    root = global;
} else if ('object' !== 'undefined') {
    root = module;
} else {
    root = Function('return this')();
}
var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
}
// symbol-observable/lib/ponyfill.js
$fsx.f[138] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
    var result;
    var _Symbol = root.Symbol;
    if (typeof _Symbol === 'function') {
        if (_Symbol.observable) {
            result = _Symbol.observable;
        } else {
            result = _Symbol('observable');
            _Symbol.observable = result;
        }
    } else {
        result = '@@observable';
    }
    return result;
}
;
}
// tree-selector/lib/cjs/index.js
$fsx.f[139] = function(module,exports){
function __export(m) {
    for (var p in m)
        if (!exports.hasOwnProperty(p))
            exports[p] = m[p];
}
Object.defineProperty(exports, '__esModule', { value: true });
__export($fsx.r(140));
var matches_1 = $fsx.r(141);
exports.createMatches = matches_1.createMatches;
var querySelector_1 = $fsx.r(142);
exports.createQuerySelector = querySelector_1.createQuerySelector;
}
// tree-selector/lib/cjs/selectorParser.js
$fsx.f[140] = function(module,exports){
var __assign = this && this.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, '__esModule', { value: true });
var IDENT = '[\\w-]+';
var SPACE = '[ \t]*';
var VALUE = '[^\\]]+';
var CLASS = '(?:\\.' + IDENT + ')';
var ID = '(?:#' + IDENT + ')';
var OP = '(?:=|\\$=|\\^=|\\*=|~=|\\|=)';
var ATTR = '(?:\\[' + SPACE + IDENT + SPACE + '(?:' + OP + SPACE + VALUE + SPACE + ')?\\])';
var SUBTREE = '(?:[ \t]+)';
var CHILD = '(?:' + SPACE + '(>)' + SPACE + ')';
var NEXT_SIBLING = '(?:' + SPACE + '(\\+)' + SPACE + ')';
var SIBLING = '(?:' + SPACE + '(~)' + SPACE + ')';
var COMBINATOR = '(?:' + SUBTREE + '|' + CHILD + '|' + NEXT_SIBLING + '|' + SIBLING + ')';
var CONTAINS = 'contains\\("[^"]*"\\)';
var FORMULA = '(?:even|odd|\\d*(?:-?n(?:\\+\\d+)?)?)';
var NTH_CHILD = 'nth-child\\(' + FORMULA + '\\)';
var PSEUDO = ':(?:first-child|last-child|' + NTH_CHILD + '|empty|root|' + CONTAINS + ')';
var TAG = '(:?' + IDENT + ')?';
var TOKENS = CLASS + '|' + ID + '|' + ATTR + '|' + PSEUDO + '|' + COMBINATOR;
var combinatorRegex = new RegExp('^' + COMBINATOR + '$');
function parseSelector(selector) {
    var sel = selector.trim();
    var tagRegex = new RegExp(TAG, 'y');
    var tag = tagRegex.exec(sel)[0];
    var regex = new RegExp(TOKENS, 'y');
    regex.lastIndex = tagRegex.lastIndex;
    var matches = [];
    var nextSelector = undefined;
    var lastCombinator = undefined;
    var index = -1;
    while (regex.lastIndex < sel.length) {
        var match = regex.exec(sel);
        if (!match && lastCombinator === undefined) {
            throw new Error('Parse error, invalid selector');
        } else if (match && combinatorRegex.test(match[0])) {
            var comb = combinatorRegex.exec(match[0])[0];
            lastCombinator = comb;
            index = regex.lastIndex;
        } else {
            if (lastCombinator !== undefined) {
                nextSelector = [
                    getCombinator(lastCombinator),
                    parseSelector(sel.substring(index))
                ];
                break;
            }
            matches.push(match[0]);
        }
    }
    var classList = matches.filter(function (s) {
        return s.startsWith('.');
    }).map(function (s) {
        return s.substring(1);
    });
    var ids = matches.filter(function (s) {
        return s.startsWith('#');
    }).map(function (s) {
        return s.substring(1);
    });
    if (ids.length > 1) {
        throw new Error('Invalid selector, only one id is allowed');
    }
    var postprocessRegex = new RegExp('(' + IDENT + ')' + SPACE + '(' + OP + ')?' + SPACE + '(' + VALUE + ')?');
    var attrs = matches.filter(function (s) {
        return s.startsWith('[');
    }).map(function (s) {
        return postprocessRegex.exec(s).slice(1, 4);
    }).map(function (_a) {
        var attr = _a[0], op = _a[1], val = _a[2];
        return _b = {}, _b[attr] = [
            getOp(op),
            val ? parseAttrValue(val) : val
        ], _b;
        var _b;
    }).reduce(function (acc, curr) {
        return __assign({}, acc, curr);
    }, {});
    var pseudos = matches.filter(function (s) {
        return s.startsWith(':');
    }).map(function (s) {
        return postProcessPseudos(s.substring(1));
    });
    return {
        id: ids[0] || '',
        tag: tag,
        classList: classList,
        attributes: attrs,
        nextSelector: nextSelector,
        pseudos: pseudos
    };
}
exports.parseSelector = parseSelector;
function parseAttrValue(v) {
    if (v.startsWith('"')) {
        return v.slice(1, -1);
    }
    if (v === 'true') {
        return true;
    }
    if (v === 'false') {
        return false;
    }
    return parseFloat(v);
}
function postProcessPseudos(sel) {
    if (sel === 'first-child' || sel === 'last-child' || sel === 'root' || sel === 'empty') {
        return [
            sel,
            undefined
        ];
    }
    if (sel.startsWith('contains')) {
        var text = sel.slice(10, -2);
        return [
            'contains',
            text
        ];
    }
    var content = sel.slice(10, -1);
    if (content === 'even') {
        content = '2n';
    }
    if (content === 'odd') {
        content = '2n+1';
    }
    return [
        'nth-child',
        content
    ];
}
function getOp(op) {
    switch (op) {
    case '=':
        return 'exact';
    case '^=':
        return 'startsWith';
    case '$=':
        return 'endsWith';
    case '*=':
        return 'contains';
    case '~=':
        return 'whitespace';
    case '|=':
        return 'dash';
    default:
        return 'truthy';
    }
}
function getCombinator(comb) {
    switch (comb.trim()) {
    case '>':
        return 'child';
    case '+':
        return 'nextSibling';
    case '~':
        return 'sibling';
    default:
        return 'subtree';
    }
}
}
// tree-selector/lib/cjs/matches.js
$fsx.f[141] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var selectorParser_1 = $fsx.r(140);
function createMatches(opts) {
    return function matches(selector, node) {
        var _a = typeof selector === 'object' ? selector : selectorParser_1.parseSelector(selector), tag = _a.tag, id = _a.id, classList = _a.classList, attributes = _a.attributes, nextSelector = _a.nextSelector, pseudos = _a.pseudos;
        if (nextSelector !== undefined) {
            throw new Error('matches can only process selectors that target a single element');
        }
        if (tag && tag.toLowerCase() !== opts.tag(node).toLowerCase()) {
            return false;
        }
        if (id && id !== opts.id(node)) {
            return false;
        }
        var classes = opts.className(node).split(' ');
        for (var i = 0; i < classList.length; i++) {
            if (classes.indexOf(classList[i]) === -1) {
                return false;
            }
        }
        for (var key in attributes) {
            var attr = opts.attr(node, key);
            var t = attributes[key][0];
            var v = attributes[key][1];
            if (!attr) {
                return false;
            }
            if (t === 'exact' && attr !== v) {
                return false;
            } else if (t !== 'exact') {
                if (typeof v !== 'string') {
                    throw new Error('All non-string values have to be an exact match');
                }
                if (t === 'startsWith' && !attr.startsWith(v)) {
                    return false;
                }
                if (t === 'endsWith' && !attr.endsWith(v)) {
                    return false;
                }
                if (t === 'contains' && attr.indexOf(v) === -1) {
                    return false;
                }
                if (t === 'whitespace' && attr.split(' ').indexOf(v) === -1) {
                    return false;
                }
                if (t === 'dash' && attr.split('-').indexOf(v) === -1) {
                    return false;
                }
            }
        }
        for (var i = 0; i < pseudos.length; i++) {
            var _b = pseudos[i], t = _b[0], data = _b[1];
            if (t === 'contains' && data !== opts.contents(node)) {
                return false;
            }
            if (t === 'empty' && (opts.contents(node) || opts.children(node).length !== 0)) {
                return false;
            }
            if (t === 'root' && opts.parent(node) !== undefined) {
                return false;
            }
            if (t.indexOf('child') !== -1) {
                if (!opts.parent(node)) {
                    return false;
                }
                var siblings = opts.children(opts.parent(node));
                if (t === 'first-child' && siblings.indexOf(node) !== 0) {
                    return false;
                }
                if (t === 'last-child' && siblings.indexOf(node) !== siblings.length - 1) {
                    return false;
                }
                if (t === 'nth-child') {
                    var regex = /([\+-]?)(\d*)(n?)(\+\d+)?/;
                    var parseResult = regex.exec(data).slice(1);
                    var index = siblings.indexOf(node);
                    if (!parseResult[0]) {
                        parseResult[0] = '+';
                    }
                    var factor = parseResult[1] ? parseInt(parseResult[0] + parseResult[1]) : undefined;
                    var add = parseInt(parseResult[3] || '0');
                    if (factor && parseResult[2] === 'n' && index % factor !== add) {
                        return false;
                    } else if (!factor && parseResult[2] && (parseResult[0] === '+' && index - add < 0 || parseResult[0] === '-' && index - add >= 0)) {
                        return false;
                    } else if (!parseResult[2] && factor && index !== factor - 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
}
exports.createMatches = createMatches;
}
// tree-selector/lib/cjs/querySelector.js
$fsx.f[142] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var selectorParser_1 = $fsx.r(140);
var matches_1 = $fsx.r(141);
function createQuerySelector(options, matches) {
    var _matches = matches || matches_1.createMatches(options);
    function findSubtree(selector, depth, node) {
        var n = _matches(selector, node);
        var matched = n ? typeof n === 'object' ? [n] : [node] : [];
        if (depth === 0) {
            return matched;
        }
        var childMatched = options.children(node).filter(function (c) {
            return typeof c !== 'string';
        }).map(function (c) {
            return findSubtree(selector, depth - 1, c);
        }).reduce(function (acc, curr) {
            return acc.concat(curr);
        }, []);
        return matched.concat(childMatched);
    }
    function findSibling(selector, next, node) {
        if (options.parent(node) === undefined) {
            return [];
        }
        var results = [];
        var siblings = options.children(options.parent(node));
        for (var i = siblings.indexOf(node) + 1; i < siblings.length; i++) {
            if (typeof siblings[i] === 'string') {
                continue;
            }
            var n = _matches(selector, siblings[i]);
            if (n) {
                if (typeof n === 'object') {
                    results.push(n);
                } else {
                    results.push(siblings[i]);
                }
            }
            if (next) {
                break;
            }
        }
        return results;
    }
    return function querySelector(selector, node) {
        var sel = typeof selector === 'object' ? selector : selectorParser_1.parseSelector(selector);
        var results = [node];
        var currentSelector = sel;
        var currentCombinator = 'subtree';
        var tail = undefined;
        var _loop_1 = function () {
            tail = currentSelector.nextSelector;
            currentSelector.nextSelector = undefined;
            if (currentCombinator === 'subtree' || currentCombinator === 'child') {
                var depth_1 = currentCombinator === 'subtree' ? Infinity : 1;
                results = results.map(function (n) {
                    return findSubtree(currentSelector, depth_1, n);
                }).reduce(function (acc, curr) {
                    return acc.concat(curr);
                }, []);
            } else {
                var next_1 = currentCombinator === 'nextSibling';
                results = results.map(function (n) {
                    return findSibling(currentSelector, next_1, n);
                }).reduce(function (acc, curr) {
                    return acc.concat(curr);
                }, []);
            }
            if (tail) {
                currentSelector = tail[1];
                currentCombinator = tail[0];
            }
        };
        do {
            _loop_1();
        } while (tail !== undefined);
        return results;
    };
}
exports.createQuerySelector = createQuerySelector;
}
// typestyle/lib/index.js
$fsx.f[143] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var typestyle_1 = $fsx.r(144);
exports.TypeStyle = typestyle_1.TypeStyle;
var types = $fsx.r(147);
exports.types = types;
var utilities_1 = $fsx.r(146);
exports.extend = utilities_1.extend;
exports.classes = utilities_1.classes;
exports.media = utilities_1.media;
var ts = new typestyle_1.TypeStyle({ autoGenerateTag: true });
exports.setStylesTarget = ts.setStylesTarget;
exports.cssRaw = ts.cssRaw;
exports.cssRule = ts.cssRule;
exports.forceRenderStyles = ts.forceRenderStyles;
exports.fontFace = ts.fontFace;
exports.getStyles = ts.getStyles;
exports.keyframes = ts.keyframes;
exports.reinit = ts.reinit;
exports.style = ts.style;
exports.stylesheet = ts.stylesheet;
function createTypeStyle(target) {
    var instance = new typestyle_1.TypeStyle({ autoGenerateTag: false });
    if (target) {
        instance.setStylesTarget(target);
    }
    return instance;
}
exports.createTypeStyle = createTypeStyle;
}
// typestyle/lib/internal/typestyle.js
$fsx.f[144] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var FreeStyle = $fsx.r(113);
var formatting_1 = $fsx.r(145);
var utilities_1 = $fsx.r(146);
var createFreeStyle = function () {
    return FreeStyle.create(undefined, true);
};
var TypeStyle = function () {
    function TypeStyle(_a) {
        var autoGenerateTag = _a.autoGenerateTag;
        var _this = this;
        this.cssRaw = function (mustBeValidCSS) {
            if (!mustBeValidCSS) {
                return;
            }
            _this._raw += mustBeValidCSS || '';
            _this._pendingRawChange = true;
            _this._styleUpdated();
        };
        this.cssRule = function (selector) {
            var objects = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                objects[_i - 1] = arguments[_i];
            }
            var object = formatting_1.ensureStringObj(utilities_1.extend.apply(void 0, objects)).result;
            _this._freeStyle.registerRule(selector, object);
            _this._styleUpdated();
            return;
        };
        this.forceRenderStyles = function () {
            var target = _this._getTag();
            if (!target) {
                return;
            }
            target.textContent = _this.getStyles();
        };
        this.fontFace = function () {
            var fontFace = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fontFace[_i] = arguments[_i];
            }
            var freeStyle = _this._freeStyle;
            for (var _a = 0, _b = fontFace; _a < _b.length; _a++) {
                var face = _b[_a];
                freeStyle.registerRule('@font-face', face);
            }
            _this._styleUpdated();
            return;
        };
        this.getStyles = function () {
            return (_this._raw || '') + _this._freeStyle.getStyles();
        };
        this.keyframes = function (frames) {
            var _a = formatting_1.explodeKeyframes(frames), keyframes = _a.keyframes, $debugName = _a.$debugName;
            var animationName = _this._freeStyle.registerKeyframes(keyframes, $debugName);
            _this._styleUpdated();
            return animationName;
        };
        this.reinit = function () {
            var freeStyle = createFreeStyle();
            _this._freeStyle = freeStyle;
            _this._lastFreeStyleChangeId = freeStyle.changeId;
            _this._raw = '';
            _this._pendingRawChange = false;
            var target = _this._getTag();
            if (target) {
                target.textContent = '';
            }
        };
        this.setStylesTarget = function (tag) {
            if (_this._tag) {
                _this._tag.textContent = '';
            }
            _this._tag = tag;
            _this.forceRenderStyles();
        };
        this.stylesheet = function (classes) {
            var classNames = Object.getOwnPropertyNames(classes);
            var result = {};
            for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
                var className = classNames_1[_i];
                var classDef = classes[className];
                if (classDef) {
                    classDef.$debugName = className;
                    result[className] = _this.style(classDef);
                }
            }
            return result;
        };
        var freeStyle = createFreeStyle();
        this._autoGenerateTag = autoGenerateTag;
        this._freeStyle = freeStyle;
        this._lastFreeStyleChangeId = freeStyle.changeId;
        this._pending = 0;
        this._pendingRawChange = false;
        this._raw = '';
        this._tag = undefined;
        this.style = this.style.bind(this);
    }
    TypeStyle.prototype._afterAllSync = function (cb) {
        var _this = this;
        this._pending++;
        var pending = this._pending;
        utilities_1.raf(function () {
            if (pending !== _this._pending) {
                return;
            }
            cb();
        });
    };
    TypeStyle.prototype._getTag = function () {
        if (this._tag) {
            return this._tag;
        }
        if (this._autoGenerateTag) {
            var tag = 'object' === 'undefined' ? { textContent: '' } : document.createElement('style');
            if (typeof document !== 'undefined') {
                document.head.appendChild(tag);
            }
            this._tag = tag;
            return tag;
        }
        return undefined;
    };
    TypeStyle.prototype._styleUpdated = function () {
        var _this = this;
        var changeId = this._freeStyle.changeId;
        var lastChangeId = this._lastFreeStyleChangeId;
        if (!this._pendingRawChange && changeId === lastChangeId) {
            return;
        }
        this._lastFreeStyleChangeId = changeId;
        this._pendingRawChange = false;
        this._afterAllSync(function () {
            return _this.forceRenderStyles();
        });
    };
    TypeStyle.prototype.style = function () {
        var freeStyle = this._freeStyle;
        var _a = formatting_1.ensureStringObj(utilities_1.extend.apply(undefined, arguments)), result = _a.result, debugName = _a.debugName;
        var className = debugName ? freeStyle.registerStyle(result, debugName) : freeStyle.registerStyle(result);
        this._styleUpdated();
        return className;
    };
    return TypeStyle;
}();
exports.TypeStyle = TypeStyle;
}
// typestyle/lib/internal/formatting.js
$fsx.f[145] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var FreeStyle = $fsx.r(113);
function ensureStringObj(object) {
    var result = {};
    var debugName = '';
    for (var key in object) {
        var val = object[key];
        if (key === '$unique') {
            result[FreeStyle.IS_UNIQUE] = val;
        } else if (key === '$nest') {
            var nested = val;
            for (var selector in nested) {
                var subproperties = nested[selector];
                result[selector] = ensureStringObj(subproperties).result;
            }
        } else if (key === '$debugName') {
            debugName = val;
        } else {
            result[key] = val;
        }
    }
    return {
        result: result,
        debugName: debugName
    };
}
exports.ensureStringObj = ensureStringObj;
function explodeKeyframes(frames) {
    var result = {
        $debugName: undefined,
        keyframes: {}
    };
    for (var offset in frames) {
        var val = frames[offset];
        if (offset === '$debugName') {
            result.$debugName = val;
        } else {
            result.keyframes[offset] = val;
        }
    }
    return result;
}
exports.explodeKeyframes = explodeKeyframes;
}
// typestyle/lib/internal/utilities.js
$fsx.f[146] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
exports.raf = typeof requestAnimationFrame === 'undefined' ? function (cb) {
    return setTimeout(cb);
} : 'object' === 'undefined' ? requestAnimationFrame : requestAnimationFrame.bind(window);
function classes() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.filter(function (c) {
        return !!c;
    }).join(' ');
}
exports.classes = classes;
function extend() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var result = {};
    for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
        var object = objects_1[_a];
        if (object == null || object === false) {
            continue;
        }
        for (var key in object) {
            var val = object[key];
            if (!val && val !== 0) {
                continue;
            }
            if (key === '$nest' && val) {
                result[key] = result['$nest'] ? extend(result['$nest'], val) : val;
            } else if (key.indexOf('&') !== -1 || key.indexOf('@media') === 0) {
                result[key] = result[key] ? extend(result[key], val) : val;
            } else {
                result[key] = val;
            }
        }
    }
    return result;
}
exports.extend = extend;
exports.media = function (mediaQuery) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    var mediaQuerySections = [];
    if (mediaQuery.type)
        mediaQuerySections.push(mediaQuery.type);
    if (mediaQuery.orientation)
        mediaQuerySections.push('(orientation: ' + mediaQuery.orientation + ')');
    if (mediaQuery.minWidth)
        mediaQuerySections.push('(min-width: ' + mediaLength(mediaQuery.minWidth) + ')');
    if (mediaQuery.maxWidth)
        mediaQuerySections.push('(max-width: ' + mediaLength(mediaQuery.maxWidth) + ')');
    if (mediaQuery.minHeight)
        mediaQuerySections.push('(min-height: ' + mediaLength(mediaQuery.minHeight) + ')');
    if (mediaQuery.maxHeight)
        mediaQuerySections.push('(max-height: ' + mediaLength(mediaQuery.maxHeight) + ')');
    var stringMediaQuery = '@media ' + mediaQuerySections.join(' and ');
    var object = { $nest: (_a = {}, _a[stringMediaQuery] = extend.apply(void 0, objects), _a) };
    return object;
    var _a;
};
var mediaLength = function (value) {
    return typeof value === 'string' ? value : value + 'px';
};
}
// typestyle/lib/types.js
$fsx.f[147] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
}
// xstream/index.js
$fsx.f[148] = function(module,exports){
var __extends = this && this.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var symbol_observable_1 = $fsx.r(137);
var NO = {};
exports.NO = NO;
function noop() {
}
function cp(a) {
    var l = a.length;
    var b = Array(l);
    for (var i = 0; i < l; ++i)
        b[i] = a[i];
    return b;
}
function and(f1, f2) {
    return function andFn(t) {
        return f1(t) && f2(t);
    };
}
function _try(c, t, u) {
    try {
        return c.f(t);
    } catch (e) {
        u._e(e);
        return NO;
    }
}
var NO_IL = {
    _n: noop,
    _e: noop,
    _c: noop
};
exports.NO_IL = NO_IL;
function internalizeProducer(producer) {
    producer._start = function _start(il) {
        il.next = il._n;
        il.error = il._e;
        il.complete = il._c;
        this.start(il);
    };
    producer._stop = producer.stop;
}
var StreamSub = function () {
    function StreamSub(_stream, _listener) {
        this._stream = _stream;
        this._listener = _listener;
    }
    StreamSub.prototype.unsubscribe = function () {
        this._stream._remove(this._listener);
    };
    return StreamSub;
}();
var Observer = function () {
    function Observer(_listener) {
        this._listener = _listener;
    }
    Observer.prototype.next = function (value) {
        this._listener._n(value);
    };
    Observer.prototype.error = function (err) {
        this._listener._e(err);
    };
    Observer.prototype.complete = function () {
        this._listener._c();
    };
    return Observer;
}();
var FromObservable = function () {
    function FromObservable(observable) {
        this.type = 'fromObservable';
        this.ins = observable;
        this.active = false;
    }
    FromObservable.prototype._start = function (out) {
        this.out = out;
        this.active = true;
        this._sub = this.ins.subscribe(new Observer(out));
        if (!this.active)
            this._sub.unsubscribe();
    };
    FromObservable.prototype._stop = function () {
        if (this._sub)
            this._sub.unsubscribe();
        this.active = false;
    };
    return FromObservable;
}();
var Merge = function () {
    function Merge(insArr) {
        this.type = 'merge';
        this.insArr = insArr;
        this.out = NO;
        this.ac = 0;
    }
    Merge.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var L = s.length;
        this.ac = L;
        for (var i = 0; i < L; i++)
            s[i]._add(this);
    };
    Merge.prototype._stop = function () {
        var s = this.insArr;
        var L = s.length;
        for (var i = 0; i < L; i++)
            s[i]._remove(this);
        this.out = NO;
    };
    Merge.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    Merge.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Merge.prototype._c = function () {
        if (--this.ac <= 0) {
            var u = this.out;
            if (u === NO)
                return;
            u._c();
        }
    };
    return Merge;
}();
var CombineListener = function () {
    function CombineListener(i, out, p) {
        this.i = i;
        this.out = out;
        this.p = p;
        p.ils.push(this);
    }
    CombineListener.prototype._n = function (t) {
        var p = this.p, out = this.out;
        if (out === NO)
            return;
        if (p.up(t, this.i)) {
            var a = p.vals;
            var l = a.length;
            var b = Array(l);
            for (var i = 0; i < l; ++i)
                b[i] = a[i];
            out._n(b);
        }
    };
    CombineListener.prototype._e = function (err) {
        var out = this.out;
        if (out === NO)
            return;
        out._e(err);
    };
    CombineListener.prototype._c = function () {
        var p = this.p;
        if (p.out === NO)
            return;
        if (--p.Nc === 0)
            p.out._c();
    };
    return CombineListener;
}();
var Combine = function () {
    function Combine(insArr) {
        this.type = 'combine';
        this.insArr = insArr;
        this.out = NO;
        this.ils = [];
        this.Nc = this.Nn = 0;
        this.vals = [];
    }
    Combine.prototype.up = function (t, i) {
        var v = this.vals[i];
        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
        this.vals[i] = t;
        return Nn === 0;
    };
    Combine.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var n = this.Nc = this.Nn = s.length;
        var vals = this.vals = new Array(n);
        if (n === 0) {
            out._n([]);
            out._c();
        } else {
            for (var i = 0; i < n; i++) {
                vals[i] = NO;
                s[i]._add(new CombineListener(i, out, this));
            }
        }
    };
    Combine.prototype._stop = function () {
        var s = this.insArr;
        var n = s.length;
        var ils = this.ils;
        for (var i = 0; i < n; i++)
            s[i]._remove(ils[i]);
        this.out = NO;
        this.ils = [];
        this.vals = [];
    };
    return Combine;
}();
var FromArray = function () {
    function FromArray(a) {
        this.type = 'fromArray';
        this.a = a;
    }
    FromArray.prototype._start = function (out) {
        var a = this.a;
        for (var i = 0, n = a.length; i < n; i++)
            out._n(a[i]);
        out._c();
    };
    FromArray.prototype._stop = function () {
    };
    return FromArray;
}();
var FromPromise = function () {
    function FromPromise(p) {
        this.type = 'fromPromise';
        this.on = false;
        this.p = p;
    }
    FromPromise.prototype._start = function (out) {
        var prod = this;
        this.on = true;
        this.p.then(function (v) {
            if (prod.on) {
                out._n(v);
                out._c();
            }
        }, function (e) {
            out._e(e);
        }).then(noop, function (err) {
            setTimeout(function () {
                throw err;
            });
        });
    };
    FromPromise.prototype._stop = function () {
        this.on = false;
    };
    return FromPromise;
}();
var Periodic = function () {
    function Periodic(period) {
        this.type = 'periodic';
        this.period = period;
        this.intervalID = -1;
        this.i = 0;
    }
    Periodic.prototype._start = function (out) {
        var self = this;
        function intervalHandler() {
            out._n(self.i++);
        }
        this.intervalID = setInterval(intervalHandler, this.period);
    };
    Periodic.prototype._stop = function () {
        if (this.intervalID !== -1)
            clearInterval(this.intervalID);
        this.intervalID = -1;
        this.i = 0;
    };
    return Periodic;
}();
var Debug = function () {
    function Debug(ins, arg) {
        this.type = 'debug';
        this.ins = ins;
        this.out = NO;
        this.s = noop;
        this.l = '';
        if (typeof arg === 'string')
            this.l = arg;
        else if (typeof arg === 'function')
            this.s = arg;
    }
    Debug.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Debug.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Debug.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var s = this.s, l = this.l;
        if (s !== noop) {
            try {
                s(t);
            } catch (e) {
                u._e(e);
            }
        } else if (l)
            console.log(l + ':', t);
        else
            console.log(t);
        u._n(t);
    };
    Debug.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Debug.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Debug;
}();
var Drop = function () {
    function Drop(max, ins) {
        this.type = 'drop';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.dropped = 0;
    }
    Drop.prototype._start = function (out) {
        this.out = out;
        this.dropped = 0;
        this.ins._add(this);
    };
    Drop.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Drop.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        if (this.dropped++ >= this.max)
            u._n(t);
    };
    Drop.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Drop.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Drop;
}();
var EndWhenListener = function () {
    function EndWhenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    EndWhenListener.prototype._n = function () {
        this.op.end();
    };
    EndWhenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    EndWhenListener.prototype._c = function () {
        this.op.end();
    };
    return EndWhenListener;
}();
var EndWhen = function () {
    function EndWhen(o, ins) {
        this.type = 'endWhen';
        this.ins = ins;
        this.out = NO;
        this.o = o;
        this.oil = NO_IL;
    }
    EndWhen.prototype._start = function (out) {
        this.out = out;
        this.o._add(this.oil = new EndWhenListener(out, this));
        this.ins._add(this);
    };
    EndWhen.prototype._stop = function () {
        this.ins._remove(this);
        this.o._remove(this.oil);
        this.out = NO;
        this.oil = NO_IL;
    };
    EndWhen.prototype.end = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    EndWhen.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    EndWhen.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    EndWhen.prototype._c = function () {
        this.end();
    };
    return EndWhen;
}();
var Filter = function () {
    function Filter(passes, ins) {
        this.type = 'filter';
        this.ins = ins;
        this.out = NO;
        this.f = passes;
    }
    Filter.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Filter.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Filter.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO || !r)
            return;
        u._n(t);
    };
    Filter.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Filter.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Filter;
}();
var FlattenListener = function () {
    function FlattenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    FlattenListener.prototype._n = function (t) {
        this.out._n(t);
    };
    FlattenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    FlattenListener.prototype._c = function () {
        this.op.inner = NO;
        this.op.less();
    };
    return FlattenListener;
}();
var Flatten = function () {
    function Flatten(ins) {
        this.type = 'flatten';
        this.ins = ins;
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    }
    Flatten.prototype._start = function (out) {
        this.out = out;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
        this.ins._add(this);
    };
    Flatten.prototype._stop = function () {
        this.ins._remove(this);
        if (this.inner !== NO)
            this.inner._remove(this.il);
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    };
    Flatten.prototype.less = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (!this.open && this.inner === NO)
            u._c();
    };
    Flatten.prototype._n = function (s) {
        var u = this.out;
        if (u === NO)
            return;
        var _a = this, inner = _a.inner, il = _a.il;
        if (inner !== NO && il !== NO_IL)
            inner._remove(il);
        (this.inner = s)._add(this.il = new FlattenListener(u, this));
    };
    Flatten.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Flatten.prototype._c = function () {
        this.open = false;
        this.less();
    };
    return Flatten;
}();
var Fold = function () {
    function Fold(f, seed, ins) {
        var _this = this;
        this.type = 'fold';
        this.ins = ins;
        this.out = NO;
        this.f = function (t) {
            return f(_this.acc, t);
        };
        this.acc = this.seed = seed;
    }
    Fold.prototype._start = function (out) {
        this.out = out;
        this.acc = this.seed;
        out._n(this.acc);
        this.ins._add(this);
    };
    Fold.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.acc = this.seed;
    };
    Fold.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(this.acc = r);
    };
    Fold.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Fold.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Fold;
}();
var Last = function () {
    function Last(ins) {
        this.type = 'last';
        this.ins = ins;
        this.out = NO;
        this.has = false;
        this.val = NO;
    }
    Last.prototype._start = function (out) {
        this.out = out;
        this.has = false;
        this.ins._add(this);
    };
    Last.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.val = NO;
    };
    Last.prototype._n = function (t) {
        this.has = true;
        this.val = t;
    };
    Last.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Last.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (this.has) {
            u._n(this.val);
            u._c();
        } else
            u._e(new Error('last() failed because input stream completed'));
    };
    return Last;
}();
var MapOp = function () {
    function MapOp(project, ins) {
        this.type = 'map';
        this.ins = ins;
        this.out = NO;
        this.f = project;
    }
    MapOp.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    MapOp.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    MapOp.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(r);
    };
    MapOp.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    MapOp.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return MapOp;
}();
var Remember = function () {
    function Remember(ins) {
        this.type = 'remember';
        this.ins = ins;
        this.out = NO;
    }
    Remember.prototype._start = function (out) {
        this.out = out;
        this.ins._add(out);
    };
    Remember.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return Remember;
}();
var ReplaceError = function () {
    function ReplaceError(replacer, ins) {
        this.type = 'replaceError';
        this.ins = ins;
        this.out = NO;
        this.f = replacer;
    }
    ReplaceError.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    ReplaceError.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    ReplaceError.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    ReplaceError.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        try {
            this.ins._remove(this);
            (this.ins = this.f(err))._add(this);
        } catch (e) {
            u._e(e);
        }
    };
    ReplaceError.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return ReplaceError;
}();
var StartWith = function () {
    function StartWith(ins, val) {
        this.type = 'startWith';
        this.ins = ins;
        this.out = NO;
        this.val = val;
    }
    StartWith.prototype._start = function (out) {
        this.out = out;
        this.out._n(this.val);
        this.ins._add(out);
    };
    StartWith.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return StartWith;
}();
var Take = function () {
    function Take(max, ins) {
        this.type = 'take';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.taken = 0;
    }
    Take.prototype._start = function (out) {
        this.out = out;
        this.taken = 0;
        if (this.max <= 0)
            out._c();
        else
            this.ins._add(this);
    };
    Take.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Take.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var m = ++this.taken;
        if (m < this.max)
            u._n(t);
        else if (m === this.max) {
            u._n(t);
            u._c();
        }
    };
    Take.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Take.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Take;
}();
var Stream = function () {
    function Stream(producer) {
        this._prod = producer || NO;
        this._ils = [];
        this._stopID = NO;
        this._dl = NO;
        this._d = false;
        this._target = NO;
        this._err = NO;
    }
    Stream.prototype._n = function (t) {
        var a = this._ils;
        var L = a.length;
        if (this._d)
            this._dl._n(t);
        if (L == 1)
            a[0]._n(t);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._n(t);
        }
    };
    Stream.prototype._e = function (err) {
        if (this._err !== NO)
            return;
        this._err = err;
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._e(err);
        if (L == 1)
            a[0]._e(err);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._e(err);
        }
        if (!this._d && L == 0)
            throw this._err;
    };
    Stream.prototype._c = function () {
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._c();
        if (L == 1)
            a[0]._c();
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._c();
        }
    };
    Stream.prototype._x = function () {
        if (this._ils.length === 0)
            return;
        if (this._prod !== NO)
            this._prod._stop();
        this._err = NO;
        this._ils = [];
    };
    Stream.prototype._stopNow = function () {
        this._prod._stop();
        this._err = NO;
        this._stopID = NO;
    };
    Stream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1)
            return;
        if (this._stopID !== NO) {
            clearTimeout(this._stopID);
            this._stopID = NO;
        } else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    Stream.prototype._remove = function (il) {
        var _this = this;
        var ta = this._target;
        if (ta !== NO)
            return ta._remove(il);
        var a = this._ils;
        var i = a.indexOf(il);
        if (i > -1) {
            a.splice(i, 1);
            if (this._prod !== NO && a.length <= 0) {
                this._err = NO;
                this._stopID = setTimeout(function () {
                    return _this._stopNow();
                });
            } else if (a.length === 1) {
                this._pruneCycles();
            }
        }
    };
    Stream.prototype._pruneCycles = function () {
        if (this._hasNoSinks(this, []))
            this._remove(this._ils[0]);
    };
    Stream.prototype._hasNoSinks = function (x, trace) {
        if (trace.indexOf(x) !== -1)
            return true;
        else if (x.out === this)
            return true;
        else if (x.out && x.out !== NO)
            return this._hasNoSinks(x.out, trace.concat(x));
        else if (x._ils) {
            for (var i = 0, N = x._ils.length; i < N; i++)
                if (!this._hasNoSinks(x._ils[i], trace.concat(x)))
                    return false;
            return true;
        } else
            return false;
    };
    Stream.prototype.ctor = function () {
        return this instanceof MemoryStream ? MemoryStream : Stream;
    };
    Stream.prototype.addListener = function (listener) {
        listener._n = listener.next || noop;
        listener._e = listener.error || noop;
        listener._c = listener.complete || noop;
        this._add(listener);
    };
    Stream.prototype.removeListener = function (listener) {
        this._remove(listener);
    };
    Stream.prototype.subscribe = function (listener) {
        this.addListener(listener);
        return new StreamSub(this, listener);
    };
    Stream.prototype[symbol_observable_1.default] = function () {
        return this;
    };
    Stream.create = function (producer) {
        if (producer) {
            if (typeof producer.start !== 'function' || typeof producer.stop !== 'function')
                throw new Error('producer requires both start and stop functions');
            internalizeProducer(producer);
        }
        return new Stream(producer);
    };
    Stream.createWithMemory = function (producer) {
        if (producer)
            internalizeProducer(producer);
        return new MemoryStream(producer);
    };
    Stream.never = function () {
        return new Stream({
            _start: noop,
            _stop: noop
        });
    };
    Stream.empty = function () {
        return new Stream({
            _start: function (il) {
                il._c();
            },
            _stop: noop
        });
    };
    Stream.throw = function (error) {
        return new Stream({
            _start: function (il) {
                il._e(error);
            },
            _stop: noop
        });
    };
    Stream.from = function (input) {
        if (typeof input[symbol_observable_1.default] === 'function')
            return Stream.fromObservable(input);
        else if (typeof input.then === 'function')
            return Stream.fromPromise(input);
        else if (Array.isArray(input))
            return Stream.fromArray(input);
        throw new TypeError('Type of input to from() must be an Array, Promise, or Observable');
    };
    Stream.of = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Stream.fromArray(items);
    };
    Stream.fromArray = function (array) {
        return new Stream(new FromArray(array));
    };
    Stream.fromPromise = function (promise) {
        return new Stream(new FromPromise(promise));
    };
    Stream.fromObservable = function (obs) {
        if (obs.endWhen)
            return obs;
        var o = typeof obs[symbol_observable_1.default] === 'function' ? obs[symbol_observable_1.default]() : obs;
        return new Stream(new FromObservable(o));
    };
    Stream.periodic = function (period) {
        return new Stream(new Periodic(period));
    };
    Stream.prototype._map = function (project) {
        return new (this.ctor())(new MapOp(project, this));
    };
    Stream.prototype.map = function (project) {
        return this._map(project);
    };
    Stream.prototype.mapTo = function (projectedValue) {
        var s = this.map(function () {
            return projectedValue;
        });
        var op = s._prod;
        op.type = 'mapTo';
        return s;
    };
    Stream.prototype.filter = function (passes) {
        var p = this._prod;
        if (p instanceof Filter)
            return new Stream(new Filter(and(p.f, passes), p.ins));
        return new Stream(new Filter(passes, this));
    };
    Stream.prototype.take = function (amount) {
        return new (this.ctor())(new Take(amount, this));
    };
    Stream.prototype.drop = function (amount) {
        return new Stream(new Drop(amount, this));
    };
    Stream.prototype.last = function () {
        return new Stream(new Last(this));
    };
    Stream.prototype.startWith = function (initial) {
        return new MemoryStream(new StartWith(this, initial));
    };
    Stream.prototype.endWhen = function (other) {
        return new (this.ctor())(new EndWhen(other, this));
    };
    Stream.prototype.fold = function (accumulate, seed) {
        return new MemoryStream(new Fold(accumulate, seed, this));
    };
    Stream.prototype.replaceError = function (replace) {
        return new (this.ctor())(new ReplaceError(replace, this));
    };
    Stream.prototype.flatten = function () {
        var p = this._prod;
        return new Stream(new Flatten(this));
    };
    Stream.prototype.compose = function (operator) {
        return operator(this);
    };
    Stream.prototype.remember = function () {
        return new MemoryStream(new Remember(this));
    };
    Stream.prototype.debug = function (labelOrSpy) {
        return new (this.ctor())(new Debug(this, labelOrSpy));
    };
    Stream.prototype.imitate = function (target) {
        if (target instanceof MemoryStream)
            throw new Error('A MemoryStream was given to imitate(), but it only ' + 'supports a Stream. Read more about this restriction here: ' + 'https://github.com/staltz/xstream#faq');
        this._target = target;
        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++)
            target._add(ils[i]);
        this._ils = [];
    };
    Stream.prototype.shamefullySendNext = function (value) {
        this._n(value);
    };
    Stream.prototype.shamefullySendError = function (error) {
        this._e(error);
    };
    Stream.prototype.shamefullySendComplete = function () {
        this._c();
    };
    Stream.prototype.setDebugListener = function (listener) {
        if (!listener) {
            this._d = false;
            this._dl = NO;
        } else {
            this._d = true;
            listener._n = listener.next || noop;
            listener._e = listener.error || noop;
            listener._c = listener.complete || noop;
            this._dl = listener;
        }
    };
    Stream.merge = function merge() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Merge(streams));
    };
    Stream.combine = function combine() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Combine(streams));
    };
    return Stream;
}();
exports.Stream = Stream;
var MemoryStream = function (_super) {
    __extends(MemoryStream, _super);
    function MemoryStream(producer) {
        var _this = _super.call(this, producer) || this;
        _this._has = false;
        return _this;
    }
    MemoryStream.prototype._n = function (x) {
        this._v = x;
        this._has = true;
        _super.prototype._n.call(this, x);
    };
    MemoryStream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1) {
            if (this._has)
                il._n(this._v);
            return;
        }
        if (this._stopID !== NO) {
            if (this._has)
                il._n(this._v);
            clearTimeout(this._stopID);
            this._stopID = NO;
        } else if (this._has)
            il._n(this._v);
        else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    MemoryStream.prototype._stopNow = function () {
        this._has = false;
        _super.prototype._stopNow.call(this);
    };
    MemoryStream.prototype._x = function () {
        this._has = false;
        _super.prototype._x.call(this);
    };
    MemoryStream.prototype.map = function (project) {
        return this._map(project);
    };
    MemoryStream.prototype.mapTo = function (projectedValue) {
        return _super.prototype.mapTo.call(this, projectedValue);
    };
    MemoryStream.prototype.take = function (amount) {
        return _super.prototype.take.call(this, amount);
    };
    MemoryStream.prototype.endWhen = function (other) {
        return _super.prototype.endWhen.call(this, other);
    };
    MemoryStream.prototype.replaceError = function (replace) {
        return _super.prototype.replaceError.call(this, replace);
    };
    MemoryStream.prototype.remember = function () {
        return this;
    };
    MemoryStream.prototype.debug = function (labelOrSpy) {
        return _super.prototype.debug.call(this, labelOrSpy);
    };
    return MemoryStream;
}(Stream);
exports.MemoryStream = MemoryStream;
var xs = Stream;
exports.default = xs;
}
// xstream/extra/concat.js
$fsx.f[149] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var index_1 = $fsx.r(148);
var ConcatProducer = function () {
    function ConcatProducer(streams) {
        this.streams = streams;
        this.type = 'concat';
        this.out = null;
        this.i = 0;
    }
    ConcatProducer.prototype._start = function (out) {
        this.out = out;
        this.streams[this.i]._add(this);
    };
    ConcatProducer.prototype._stop = function () {
        var streams = this.streams;
        if (this.i < streams.length) {
            streams[this.i]._remove(this);
        }
        this.i = 0;
        this.out = null;
    };
    ConcatProducer.prototype._n = function (t) {
        var u = this.out;
        if (!u)
            return;
        u._n(t);
    };
    ConcatProducer.prototype._e = function (err) {
        var u = this.out;
        if (!u)
            return;
        u._e(err);
    };
    ConcatProducer.prototype._c = function () {
        var u = this.out;
        if (!u)
            return;
        var streams = this.streams;
        streams[this.i]._remove(this);
        if (++this.i < streams.length) {
            streams[this.i]._add(this);
        } else {
            u._c();
        }
    };
    return ConcatProducer;
}();
function concat() {
    var streams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        streams[_i] = arguments[_i];
    }
    return new index_1.Stream(new ConcatProducer(streams));
}
exports.default = concat;
}
// xstream/extra/sampleCombine.js
$fsx.f[150] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var index_1 = $fsx.r(148);
var NO = {};
var SampleCombineListener = function () {
    function SampleCombineListener(i, p) {
        this.i = i;
        this.p = p;
        p.ils[i] = this;
    }
    SampleCombineListener.prototype._n = function (t) {
        var p = this.p;
        if (p.out === NO)
            return;
        p.up(t, this.i);
    };
    SampleCombineListener.prototype._e = function (err) {
        this.p._e(err);
    };
    SampleCombineListener.prototype._c = function () {
        this.p.down(this.i, this);
    };
    return SampleCombineListener;
}();
exports.SampleCombineListener = SampleCombineListener;
var SampleCombineOperator = function () {
    function SampleCombineOperator(ins, streams) {
        this.type = 'sampleCombine';
        this.ins = ins;
        this.others = streams;
        this.out = NO;
        this.ils = [];
        this.Nn = 0;
        this.vals = [];
    }
    SampleCombineOperator.prototype._start = function (out) {
        this.out = out;
        var s = this.others;
        var n = this.Nn = s.length;
        var vals = this.vals = new Array(n);
        for (var i = 0; i < n; i++) {
            vals[i] = NO;
            s[i]._add(new SampleCombineListener(i, this));
        }
        this.ins._add(this);
    };
    SampleCombineOperator.prototype._stop = function () {
        var s = this.others;
        var n = s.length;
        var ils = this.ils;
        this.ins._remove(this);
        for (var i = 0; i < n; i++) {
            s[i]._remove(ils[i]);
        }
        this.out = NO;
        this.vals = [];
        this.ils = [];
    };
    SampleCombineOperator.prototype._n = function (t) {
        var out = this.out;
        if (out === NO)
            return;
        if (this.Nn > 0)
            return;
        out._n([t].concat(this.vals));
    };
    SampleCombineOperator.prototype._e = function (err) {
        var out = this.out;
        if (out === NO)
            return;
        out._e(err);
    };
    SampleCombineOperator.prototype._c = function () {
        var out = this.out;
        if (out === NO)
            return;
        out._c();
    };
    SampleCombineOperator.prototype.up = function (t, i) {
        var v = this.vals[i];
        if (this.Nn > 0 && v === NO) {
            this.Nn--;
        }
        this.vals[i] = t;
    };
    SampleCombineOperator.prototype.down = function (i, l) {
        this.others[i]._remove(l);
    };
    return SampleCombineOperator;
}();
exports.SampleCombineOperator = SampleCombineOperator;
var sampleCombine;
sampleCombine = function sampleCombine() {
    var streams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        streams[_i] = arguments[_i];
    }
    return function sampleCombineOperator(sampler) {
        return new index_1.Stream(new SampleCombineOperator(sampler, streams));
    };
};
exports.default = sampleCombine;
}
// xstream/extra/dropRepeats.js
$fsx.f[151] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var index_1 = $fsx.r(148);
var empty = {};
var DropRepeatsOperator = function () {
    function DropRepeatsOperator(ins, fn) {
        this.ins = ins;
        this.type = 'dropRepeats';
        this.out = null;
        this.v = empty;
        this.isEq = fn ? fn : function (x, y) {
            return x === y;
        };
    }
    DropRepeatsOperator.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    DropRepeatsOperator.prototype._stop = function () {
        this.ins._remove(this);
        this.out = null;
        this.v = empty;
    };
    DropRepeatsOperator.prototype._n = function (t) {
        var u = this.out;
        if (!u)
            return;
        var v = this.v;
        if (v !== empty && this.isEq(t, v))
            return;
        this.v = t;
        u._n(t);
    };
    DropRepeatsOperator.prototype._e = function (err) {
        var u = this.out;
        if (!u)
            return;
        u._e(err);
    };
    DropRepeatsOperator.prototype._c = function () {
        var u = this.out;
        if (!u)
            return;
        u._c();
    };
    return DropRepeatsOperator;
}();
exports.DropRepeatsOperator = DropRepeatsOperator;
function dropRepeats(isEqual) {
    if (isEqual === void 0) {
        isEqual = void 0;
    }
    return function dropRepeatsOperator(ins) {
        return new index_1.Stream(new DropRepeatsOperator(ins, isEqual));
    };
}
exports.default = dropRepeats;
}
// xstream/extra/throttle.js
$fsx.f[152] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var index_1 = $fsx.r(148);
var ThrottleOperator = function () {
    function ThrottleOperator(dt, ins) {
        this.dt = dt;
        this.ins = ins;
        this.type = 'throttle';
        this.out = null;
        this.id = null;
    }
    ThrottleOperator.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    ThrottleOperator.prototype._stop = function () {
        this.ins._remove(this);
        this.out = null;
        this.id = null;
    };
    ThrottleOperator.prototype.clearInterval = function () {
        var id = this.id;
        if (id !== null) {
            clearInterval(id);
        }
        this.id = null;
    };
    ThrottleOperator.prototype._n = function (t) {
        var _this = this;
        var u = this.out;
        if (!u)
            return;
        if (this.id)
            return;
        u._n(t);
        this.id = setInterval(function () {
            _this.clearInterval();
        }, this.dt);
    };
    ThrottleOperator.prototype._e = function (err) {
        var u = this.out;
        if (!u)
            return;
        this.clearInterval();
        u._e(err);
    };
    ThrottleOperator.prototype._c = function () {
        var u = this.out;
        if (!u)
            return;
        this.clearInterval();
        u._c();
    };
    return ThrottleOperator;
}();
function throttle(period) {
    return function throttleOperator(ins) {
        return new index_1.Stream(new ThrottleOperator(period, ins));
    };
}
exports.default = throttle;
}
var global = window
$fsx.r(0)
})($fsx);