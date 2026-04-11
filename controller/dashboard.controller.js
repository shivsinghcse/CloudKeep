const FileModel = require("../model/file.model")
const mongoose = require('mongoose')


// const fetchDashboard = async (req, res) => {
//     try {
//         const reports = await FileModel.aggregate([
//             { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, // only current user's files
//             {
//                 $group: {
//                     _id: "$type",
//                     total: { $sum: 1 }
//                 }
//             },
//             { $sort: { total: -1 } } // highest count first
//         ])
//         res.status(200).json(reports)
//     }
//     catch(err) {
//         res.status(500).json({ message: err.message })
//     }
// }

const fetchDashboard = async (req, res) => {
    try {
        const reports = await FileModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $addFields: {
                    category: {
                        $switch: {
                            branches: [
                                { case: { $in: ['$type', ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']] }, then: 'Images' },
                                { case: { $in: ['$type', ['mp4', 'mkv', 'mov', 'avi', 'webm']] }, then: 'Videos' },
                                { case: { $in: ['$type', ['mp3', 'wav', 'aac', 'flac']] }, then: 'Audio' },
                                { case: { $in: ['$type', ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv']] }, then: 'Documents' },
                                { case: { $in: ['$type', ['zip', 'rar', '7z', 'tar', 'gz']] }, then: 'Archives' },
                                { case: { $in: ['$type', ['js', 'ts', 'html', 'css', 'json', 'py', 'java', 'cpp', 'c', 'xml', 'jsx', 'tsx', 'php', 'sql']] }, then: 'Code' },
                                { case: { $in: ['$type', ['exe', 'msi', 'dmg', 'apk']] }, then: 'Executables' },
                            ],
                            default: 'Others'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } }
        ])

        res.status(200).json(reports)
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = {
    fetchDashboard
} 