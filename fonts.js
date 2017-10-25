exports['Inconsolata'] = function () {
    const table = ['5'], baseSize = 10, height = 12, descent = 4.199999999999999, defaultWidth = 5, re = new RegExp('([!"#\\$%&\'\\(\\)\\*\\+,\\-\\./0123456789:;<=>\\?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\\[\\\\\\]\\^_`abcdefghijklmnopqrstuvwxyz\\{\\|\\}~])');
    return function (fontSize) {
        const ratio = fontSize / baseSize;
        const getIndex = ch => {
            const m = ch.match(re);
            if (m !== null)
                for (let i = 0; i < table.length; i += 1)
                    if (m[i + 1] !== undefined)
                        return i;
        };
        const getWidth = str => {
            return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
        };
        return {
            getHeight: function () {
                return ratio * height;
            },
            getDescent: function () {
                return ratio * descent;
            },
            getWidth: getWidth
        };
    };
};
exports['IndieFlower'] = function () {
    const table = [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9'
        ], baseSize = 9, height = 10, descent = 3.5, defaultWidth = 7.25, re = new RegExp('([\',\\.])|([!\\(\\)\\-/:;I\\\\`ilst\\|])|(["\\$03689\\?JS\\[\\]acefgjor])|([#\\*\\+1245=FP\\^bdhknpquvxyz\\{\\}~])|([7<>BCDEGLORZ_])|([%&AHKNQTUVXYmw])|([@M])|([W])');
    return function (fontSize) {
        const ratio = fontSize / baseSize;
        const getIndex = ch => {
            const m = ch.match(re);
            if (m !== null)
                for (let i = 0; i < table.length; i += 1)
                    if (m[i + 1] !== undefined)
                        return i;
        };
        const getWidth = str => {
            return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
        };
        return {
            getHeight: function () {
                return ratio * height;
            },
            getDescent: function () {
                return ratio * descent;
            },
            getWidth: getWidth
        };
    };
};
exports['Roboto'] = function () {
    const table = [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '2.3125',
            '5.046875',
            '3.078125',
            '3.125',
            '5.09375',
            '2.359375',
            '2.171875',
            '4.5625',
            '4.25',
            '8.078125',
            '5.109375',
            '6.125',
            '6.40625',
            '2.4375',
            '6.1875',
            '5.34375',
            '2.375',
            '5.0625',
            '2.1875',
            '3.140625',
            '5.125',
            '3.046875',
            '3.03125',
            '6.109375'
        ], baseSize = 9, height = 11, descent = 3.8499999999999996, defaultWidth = 6.55859375, re = new RegExp('([\',;])|(["\\-\\[`t])|([\\*/\\\\\\^f])|([=>FJL_acehknsuvxyz])|([#&ABCDKPRTUVXYZ])|([%w])|([MWm])|([!])|([\\$0123456789bgp])|([\\(])|([\\)])|([\\+])|([\\.])|([:])|([<])|([\\?])|([@])|([Eq])|([G])|([HN])|([I])|([OQ])|([S])|([\\]])|([d])|([il\\|])|([j])|([o])|([r])|([\\{\\}])|([~])');
    return function (fontSize) {
        const ratio = fontSize / baseSize;
        const getIndex = ch => {
            const m = ch.match(re);
            if (m !== null)
                for (let i = 0; i < table.length; i += 1)
                    if (m[i + 1] !== undefined)
                        return i;
        };
        const getWidth = str => {
            return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
        };
        return {
            getHeight: function () {
                return ratio * height;
            },
            getDescent: function () {
                return ratio * descent;
            },
            getWidth: getWidth
        };
    };
};
exports['StalinistOne'] = function () {
    const table = [
            '121.390625',
            '233.1875',
            '247.59375',
            '64',
            '76',
            '92',
            '93',
            '98',
            '102',
            '108',
            '120',
            '122',
            '139',
            '144',
            '152',
            '162',
            '166',
            '168',
            '174',
            '188',
            '200',
            '208',
            '210',
            '212',
            '213',
            '214',
            '215',
            '217',
            '218',
            '220',
            '222',
            '226',
            '227',
            '232',
            '236',
            '237',
            '273',
            '292',
            '299',
            '314',
            '92.1875',
            '243.59375',
            '245.59375',
            '291.59375',
            '227.390625',
            '91.796875',
            '139.59375',
            '72.1875',
            '157.59375',
            '245.796875',
            '241.59375',
            '225.390625',
            '247.796875',
            '142.390625',
            '255.59375',
            '253.59375',
            '255.390625',
            '253.796875',
            '257.59375',
            '257.390625',
            '251.59375',
            '225.796875',
            '293.796875',
            '249.59375',
            '235.796875'
        ], baseSize = 200, height = 295, descent = 103.25, defaultWidth = 251.5, re = new RegExp('([1])|([4])|([5])|([\'])|([`])|([\\(])|([il])|([\\[\\]])|([I])|([\\{\\}])|([_])|(["])|([j])|([\\^])|([~])|([/\\\\])|([\\+])|([t])|([f])|([r])|([x])|([y])|([J])|([v])|([nsz])|([k])|([adghq])|([o])|([c])|([e])|([bpu])|([A])|([F])|([Y])|([X])|([V])|([w])|([m])|([@])|([W])|([!\\|])|([#])|([\\$2QZ])|([%])|([&])|([\\)])|([\\*])|([,\\.:;])|([\\-=])|([069])|([3S])|([7\\?])|([8NO])|([<>])|([B])|([C])|([D])|([ER])|([G])|([HU])|([K])|([L])|([M])|([P])|([T])');
    return function (fontSize) {
        const ratio = fontSize / baseSize;
        const getIndex = ch => {
            const m = ch.match(re);
            if (m !== null)
                for (let i = 0; i < table.length; i += 1)
                    if (m[i + 1] !== undefined)
                        return i;
        };
        const getWidth = str => {
            return str.split('').reduce((acc, e) => acc + (table[getIndex(e)] || defaultWidth) * ratio, 0);
        };
        return {
            getHeight: function () {
                return ratio * height;
            },
            getDescent: function () {
                return ratio * descent;
            },
            getWidth: getWidth
        };
    };
};
