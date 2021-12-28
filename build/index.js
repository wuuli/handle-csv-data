"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var csv_parse_1 = __importDefault(require("csv-parse"));
var csv_stringify_1 = __importDefault(require("csv-stringify"));
var fs_1 = __importDefault(require("fs"));
var readline_1 = __importDefault(require("readline"));
var path_1 = __importDefault(require("path"));
var getFirstLine = function (path) {
    return new Promise(function (resolve) {
        var readable = fs_1.default.createReadStream(path);
        var reader = readline_1.default.createInterface(readable);
        reader.on('line', function (input) {
            reader.close();
            readable.close();
            resolve(input);
        });
    });
};
var DATA_DIR = 'C:\\Users\\Admin\\Desktop\\data\\live_studio_multi_hot_long';
var ORIGIN_DATA_FILE = 'live_studio_output.csv';
var GPU_LOCAL_USAGE = /.*\\GPU Process Memory\(.*\)\\Local Usage$/g;
var GPU_UTILIZATION_PERCENTAGE = /.*\\GPU Engine\(.*\)\\Utilization Percentage$/g;
var PROCESS_PROCESSOR_TIME = /.*\\Process\(.*\)\\% Processor Time$/g;
var PROCESS_WORKING_SET = /.*\\Process\(.*\)\\Working Set$/g;
var outputDir = path_1.default.join(DATA_DIR, 'output');
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir);
}
var originDataFilePath = path_1.default.join(DATA_DIR, ORIGIN_DATA_FILE);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var firstLine, counters, gpuLocalUsageCounters, gpuUtilizationPercentageCounters, processProcessorTimeCounters, processWorkingSetCounters, parserStream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getFirstLine(originDataFilePath)];
            case 1:
                firstLine = _a.sent();
                counters = firstLine.split(',').map(function (value) { return value.slice(1, -1); });
                gpuLocalUsageCounters = counters.filter(function (value) {
                    return GPU_LOCAL_USAGE.test(value);
                });
                console.info('gpuLocalUsageCounters -->', gpuLocalUsageCounters);
                gpuUtilizationPercentageCounters = counters.filter(function (value) {
                    return GPU_UTILIZATION_PERCENTAGE.test(value);
                });
                console.info('gpuUtilizationPercentageCounters -->', gpuUtilizationPercentageCounters);
                processProcessorTimeCounters = counters.filter(function (value) {
                    return PROCESS_PROCESSOR_TIME.test(value);
                });
                console.info('processProcessorTimeCounters -->', processProcessorTimeCounters);
                processWorkingSetCounters = counters.filter(function (value) {
                    return PROCESS_WORKING_SET.test(value);
                });
                console.info('processWorkingSetCounters -->', processWorkingSetCounters);
                parserStream = fs_1.default.createReadStream(originDataFilePath)
                    .pipe((0, csv_parse_1.default)({
                    columns: true
                }));
                parserStream.pipe((0, csv_stringify_1.default)({
                    header: true,
                    columns: __spreadArray([counters[0]], gpuLocalUsageCounters, true)
                })).pipe(fs_1.default.createWriteStream(path_1.default.join(outputDir, 'gpu_local_usage.csv')));
                parserStream.pipe((0, csv_stringify_1.default)({
                    header: true,
                    columns: __spreadArray([counters[0]], gpuUtilizationPercentageCounters, true)
                })).pipe(fs_1.default.createWriteStream(path_1.default.join(outputDir, 'gpu_utilization_percentage.csv')));
                parserStream.pipe((0, csv_stringify_1.default)({
                    header: true,
                    columns: __spreadArray([counters[0]], processProcessorTimeCounters, true)
                })).pipe(fs_1.default.createWriteStream(path_1.default.join(outputDir, 'process_processor_time.csv')));
                parserStream.pipe((0, csv_stringify_1.default)({
                    header: true,
                    columns: __spreadArray([counters[0]], processWorkingSetCounters, true)
                })).pipe(fs_1.default.createWriteStream(path_1.default.join(outputDir, 'process_working_set.csv')));
                return [2 /*return*/];
        }
    });
}); })();
