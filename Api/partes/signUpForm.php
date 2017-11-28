

<script>
	 $("#signUpForm").bootstrapValidator({
                message: 'Este valor no es valido',
                feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-zoom-in'
                },
                fields: {
					name:{validators:{
						regexp:{regexp:/^[A-Za-z]+$/, message:'Ingrese Solo caracteres'},
						notEmpty:{message:'Ingrese Nombre'},
					}},
					surname:{validators:{
						regexp:{regexp:/^[A-Za-z]+$/, message:'Ingrese Solo caracteres'},
						notEmpty:{message:'Ingrese Apellido'},
					}},
                    id:{validators:{
						notEmpty:{message:'Ingrese Id'},
						integer:{message:'Ingrese Id Valido'}
					}},
                    password:{validators:{
						notEmpty:{message:'Ingrese contraseña'},
                        stringLength: {min: 6,max: 8,message:'Ingrese entre 6 y 8 caracteres'},
						identical: {field: 'confirmPassword',message: 'La contraseña no coincide'}
                    }
                }
                
            
            }});
	</script>
<div class="login-form" id="signUpForm">
<div class="panel panel-default">
 <div class="panel-heading">Registro</div>
					<div class="panel-body">
					    
						
						<div class="form-group">
							<label for="name" class="cols-sm-2 control-label">Your Name</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="name" id="name"  placeholder="Enter your Name"/>
								</div>
							</div>
						</div>
                        <div class="form-group">
							<label for="surname" class="cols-sm-2 control-label">Surname</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-users fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="surname" id="surname"  placeholder="Enter your Surname"/>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="id" class="cols-sm-2 control-label">Your Id</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope fa" aria-hidden="true"></i></span>
									<input type="text" class="form-control" name="id" id="id"  placeholder="Enter your ID"/>
								</div>
							</div>
						</div>
						
	
						<div class="form-group ">
							<label for="password" class="cols-sm-2 control-label">Password</label>
							<div class="cols-sm-10">
								<div class="input-group ">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="password" id="password"  placeholder="Enter your Password"/>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="confirm" class="cols-sm-2 control-label">Confirm Password</label>
							<div class="cols-sm-10">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input type="password" class="form-control" name="confirmPassword" id="confirm"  placeholder="Confirm your Password"/>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="turno" class="cols-sm-2 control-label">Turno</label>
							<div class="cols-sm-10">
									<select  data-live-search="true" name="turno" id="turno" class="form-control">
										<option  value="1">Mañana</option>
										<option  value="2">Tarde</option>
										<option   value="3">Noche</option>
									</select>
							</div>
						</div>
						<div class="form-links">
							<label><input type="checkbox" id="state" class="text-primary" name="state" value="yes">Estado</label>&nbsp
							<label><input type="checkbox" id="admin" class="text-primary" name="admin" value="yes" >Admin</label>
						</div>

							<button type="submit" name="go" onclick=signUp() class="btn btn-lg btn-info btn-block">Sing Up</button>
					
					</div>
</div>
</div>
