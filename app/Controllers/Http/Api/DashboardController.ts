import ApiBaseController from "App/Controllers/Http/Api/ApiBaseController";
import CategoryRepo from "App/Repos/CategoryRepo";
import UserRepo from "App/Repos/UserRepo";
import ReportRepo from "App/Repos/ReportRepo";

export default class DashboardController extends ApiBaseController{

    async dashboardData(){
        const category = await CategoryRepo.model.query().select('id').getCount('id as count').first()
        const users = await UserRepo.model.query().select('id').getCount('id as count').first()
        const pendingReports = await ReportRepo.model.query().select('id').where('status',ReportRepo.model.STATUSES.PENDING).groupBy(['instance_id','instance_type'])
        const data = {
            categoryCount:category.$extras.count,
            userCount:users.$extras.count,
            pendingReportCount: pendingReports ? pendingReports.length : 0,
        }
        return this.apiResponse('Record fetched Successfully !',data)
    }

}
