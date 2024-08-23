import { BaseService } from '../../../shared/base';
import AreaModel, { Area, AreaDocument } from '../models/area';

class AreaService extends BaseService<Partial<Area>, AreaDocument> {
	constructor() {
		super(AreaModel);
	}
}

export default AreaService;
