// @ts-noCheck
import { useState } from 'react';
import { Text, View } from 'react-native';

const ChildProp = () => {
    return (
        <View className='bg-black last:text-lg' _twinOrd={0} _twinComponentID="a-660560371" _twinComponentTemplateEntries={
            []
        } _twinComponentSheet={
            require('@native-twin/jsx').StyleSheet.registerComponent("a-660560371", [{
                templateLiteral: null,
                prop: "className",
                target: "style",
                entries: [{
                    className: "bg-black",
                    declarations: [{
                        prop: "backgroundColor",
                        value: "rgba(0,0,0,1)",
                        _tag: "COMPILED"
                    }
                    ],
                    selectors: [],
                    precedence: 805306368,
                    important: false,
                    animations: []
                }
                    , {
                    className: "last:text-lg",
                    declarations: [{
                        prop: "fontSize",
                        value: 18,
                        _tag: "COMPILED"
                    }
                    ],
                    selectors: ["last", "&:last"],
                    precedence: 805437440,
                    important: false,
                    animations: []
                }
                ],
                rawSheet: {
                    base: [{
                        className: "bg-black",
                        declarations: [{
                            prop: "backgroundColor",
                            value: "rgba(0,0,0,1)",
                            _tag: "COMPILED"
                        }
                        ],
                        selectors: [],
                        precedence: 805306368,
                        important: false,
                        animations: []
                    }
                    ],
                    dark: [],
                    pointer: [],
                    group: [],
                    even: [],
                    first: [],
                    last: [],
                    odd: []
                }
            }
            ])
        }>
            <Text className='text-blue' _twinOrd={0} _twinComponentID="a:a-1160712654" _twinComponentTemplateEntries={
                []
            } _twinComponentSheet={
                require('@native-twin/jsx').StyleSheet.registerComponent("a:a-1160712654", [{
                    templateLiteral: null,
                    prop: "className",
                    target: "style",
                    entries: [{
                        className: "text-blue",
                        declarations: [{
                            prop: "color",
                            value: "rgba(96,165,250,1)",
                            _tag: "COMPILED"
                        }
                        ],
                        selectors: [],
                        precedence: 805306368,
                        important: false,
                        animations: []
                    }
                    ],
                    rawSheet: {
                        base: [{
                            className: "text-blue",
                            declarations: [{
                                prop: "color",
                                value: "rgba(96,165,250,1)",
                                _tag: "COMPILED"
                            }
                            ],
                            selectors: [],
                            precedence: 805306368,
                            important: false,
                            animations: []
                        }
                        ],
                        dark: [],
                        pointer: [],
                        group: [],
                        even: [],
                        first: [],
                        last: [],
                        odd: []
                    }
                }
                ])
            }>Text1</Text>
            <Text className='text-red' _twinOrd={1} _twinComponentID="a:b-1154500572" _twinComponentTemplateEntries={
                []
            } _twinComponentSheet={
                require('@native-twin/jsx').StyleSheet.registerComponent("a:b-1154500572", [{
                    templateLiteral: null,
                    prop: "className",
                    target: "style",
                    entries: [{
                        className: "text-red",
                        declarations: [{
                            prop: "color",
                            value: "rgba(248,113,113,1)",
                            _tag: "COMPILED"
                        }
                        ],
                        selectors: [],
                        precedence: 805306368,
                        important: false,
                        animations: []
                    }
                    ],
                    rawSheet: {
                        base: [{
                            className: "text-red",
                            declarations: [{
                                prop: "color",
                                value: "rgba(248,113,113,1)",
                                _tag: "COMPILED"
                            }
                            ],
                            selectors: [],
                            precedence: 805306368,
                            important: false,
                            animations: []
                        }
                            , {
                            className: "last:text-lg",
                            declarations: [{
                                prop: "fontSize",
                                value: 18,
                                _tag: "COMPILED"
                            }
                            ],
                            selectors: ["last", "&:last"],
                            precedence: 805437440,
                            important: false,
                            animations: []
                        }
                        ],
                        dark: [],
                        pointer: [],
                        group: [],
                        even: [],
                        first: [],
                        last: [],
                        odd: []
                    }
                }
                ])
            }>Text2</Text>
        </View>
    );
};

export { ChildProp };